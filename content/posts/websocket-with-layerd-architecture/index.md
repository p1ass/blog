---
title: レイヤードアーキテクチャを採用した際のWebSocket実装例
date: 2020-05-01T10:00:00+09:00
draft: false
description: 先日、レイヤーアーキテクチャを採用しているWeb APIサーバにWebSocketを組み込むことになったのですが、コネクションの管理やどのレイヤーで各機能を管理するか悩んだのでブログにまとめておきます。使用している言語はGoで、Webフレームワークはechoです。
categories:
- 開発
tags:
- GitHub
eyecatch: /posts/websocket-with-layerd-architecture/ogp.jpg
share: true
---

こんにちは、{{< link href="https://twitter.com/p1ass" text="@p1ass" >}}です。

先日、レイヤーアーキテクチャを採用しているWeb APIサーバにWebSocketを組み込むことになったのですが、コネクションの管理やどのレイヤーで各機能を管理するか悩んだのでブログにまとめておきます。

使用している言語はGoで、Webフレームワークはechoです。


<!--more-->

## WebSocket実装前のAPIサーバの構成

WebSocketを実装する前のAPIサーバのディレクトリ構成は次のようになっていました。（ブログ用に調整を加えてます。）

{{< highlight bash >}}
.
├── database # repositoryのインターフェースを満たす実体
├── domain 
│   ├── entity 
│   └── repository 
│   └── service 
├── main.go
├── usecase 
└── web
    ├── handler 
    └── router.go 
{{< /highlight >}}

処理の流れは以下の通りです。

{{< highlight bash >}}
web/router.go
↓
web/handler/*.go
↓
usecase/*.go
↓
domain/*
{{< /highlight >}}


レイヤードアーキテクチャを採用している無難なパッケージ構成になっています。明確にDDDやClean Architectureであるとは言えないですが、その思想を取り入れつつ独自にカスタマイズしています。[^1]

[^1]: ここではこのアーキテクチャの良し悪しについては語りません。話が逸れすぎるので。

## WebSocketの機能要件

今回のWebSocketの要件は以下の通りです。

- サーバからクライアントへのイベント通知 (JSON形式)
- クライアントからサーバへの送信は**行わない**
- クライアントは複数のセグメントに分かれている (便宜上「ルーム」と呼ぶ)
- サーバからのイベント通知はルームごとに行う
- 現時点ではサーバプロセスは1つだが、将来的にスケールアウトすることを考慮する
  - Redis PubSubなどを使ってイベントの同期をする必要はないが、実装しやすいようにしておく

メッセージのやり取りはサーバからクライアントへの一方向のみ、加えてプロセスも1個なのでそこまで複雑にはならない想定です。

## 設計する上で考えたこと

さて、このAPIサーバにWebSocketの通信を実装していくわけですが、まずは設計をしていきます。

### レイヤーを用いた責務の分離

レイヤードアーキテクチャを利用している以上当たり前ですが、責務を分離して見通しやすい実装を目指します。

### gorutineリーク、メモリリーク

通常のHTTPリクエストでは、1リクエストごとに一つのgorutineが生成されレスポンスを返したらgorotuineが終了します。

しかし、WebSocketのコネクションを扱う場合は接続している間はgoroutineが生きたままになります。コネクション切断されたときに正しくgoroutineの終了処理をしないと、段々使われなくなったgoroutineが溜まっていきメモリを圧迫してしまいます。

### スレッドセーフ

WebSocketコネクションの作成/削除時に一つのmapやsliceに複数のgoroutineからアクセスされるため、スレッドセーフになるように実装する必要があります。

また、channelを使う場合は適切にサイズを指定してデッドロックしないように気をつける必要があります。

## 実装

上記を気をつけつつ実装を行います。

### インターフェースの定義

まずは、メッセージの送信です。ドメインロジックの処理結果などを通知するのに使われるため、インターフェースはdomain packageで宣言します。

```go
type Pusher interface {
  Push(pushMsg *PushMessage) error
}
```
```go
type PushMessage struct {
  RoomID string
  Event *Event
}

type Event struct {
  Type string `json:"type`
  Content string `json:"content`
}
```

使う側はこんな感じで呼び出します。

```go
type RoomUseCase struct{
  repo repository.Room
  pusher event.Pusher
  // ...
}

func (uc *RoomUseCase) Join(roomID string, user *entity.User) error {
  room, err := uc.repo.GetByID(roomID)
  if err != nil {}

  if !room.CanJoin(user) {
    return errors.New("cannot join to room")
  }

  room.Join(user)
  if err := uc.repo.save(room); err != nil {}

  e := &entity.Event{
    Type: "JOIN",
    Content: "hogehoge",
  }
  if err := uc.pusher.Push(roomID, e); err != nil {}

  return nil
}
```

ユースケースではWebSocketの詳細には関与せず、ただメッセージを送信するだけに留めます。将来的にRedis PubSubのクライアントを注入できるようにし、拡張に強くしています。

### Pusherインターフェースの実装

次にPusherインターフェースを満たす構造体を作ります。この構造体は複数のWebSocketコネクションを一括してハンドリングし、適切なコネクションに対してメッセージを送信します。ソースコードは `web/ws/*.go` に配置します。webパッケージ内におくかどうかは悩んだのですが、HTTP上のプロトコルなのでここにしました。

WebSocketを扱うライブラリはgorrila/websocketを採用しています。READMEにも書かれている通り、半公式のgolang.org/x/net/websocketは機能が不足しています。{{< link text="GoDoc" href="https://pkg.go.dev/golang.org/x/net/websocket?tab=doc" >}}には代替案としてgorrila/websocketが書いてあるので今回はこちらを採用しました。

実装は{{< link text="gorrila/websocketのexample" href="https://github.com/gorilla/websocket/tree/master/examples/chat" >}}をとても参考にしています。

{{< ex-link url="https://github.com/gorilla/websocket" >}}

まず、WebSocketのコネクションをラップする構造体を作成します。

```go
type Client struct {
  roomID      string
  ws             *websocket.Conn
  pushCh         chan *entity.Event
  notifyClosedCh chan<- *Client // HubのunregisterWSConnChをもらう
}
```

この構造体は一つのWebSocketコネクションと一対一で対応します。そして、この `Client` 1つごとに1つのgoroutineを起動し、メッセージを送信するループを実行します。

ループがエラーで終了したときはコネクションを閉じて後述するHubに対して通知します。

```go
func (c *Client) PushLoop() {
  ticker := time.NewTicker(pingPeriod)
  defer func() {
    ticker.Stop()
    c.notifyClosedCh <- c
    c.ws.Close()
  }()

  for {
    select {
    case msg, ok := <-c.pushCh:
      if !ok {
        c.ws.SetWriteDeadline(time.Now().Add(writeWait))
        if err := c.ws.WriteMessage(websocket.CloseMessage, []byte{}); err != nil {
          fmt.Printf("failed to write close message: %v\n", err)
          return
        }
      }

      if err := c.ws.WriteJSON(msg); err != nil {
        fmt.Printf("failed to WriteJSON: %v\n", err)
        return
      }
    case <-ticker.C:
      c.ws.SetWriteDeadline(time.Now().Add(writeWait))
      if err := c.ws.WriteMessage(websocket.PingMessage, nil); err != nil {
        fmt.Printf("failed to ping: %v\n", err)
        return
      }
    }
  }
}
```

次に、すべての `Client` を管理する `Hub` 構造体を作成します。

```go
type Hub struct {
  // １つ目のキーがルームID
  // O(1) で Client を削除できるようにmapでClientを持つ
  clientsPerRoom map[string]map[*Client]struct{}
  pushMsgCh         chan *event.PushMessage
  registerCh        chan *Client
  unregisterCh      chan *Client
}
```

コメントにもある通り、コネクションが切断されたときに `Client` を削除しやすいようにmapで `Client` を持ちます。mapをスレッドセーフに扱えるように `clientsPerRoom` へのアクセスはすべて `Run()` のループから行うようにします。

```go
func (h *Hub) Register(client *Client) {
  h.registerCh <- client
}
func (h *Hub) Unregister(client *Client) {
  h.unregisterCh <- client
}

func (h *Hub) Run() {
  for {
    select {
    case cli := <-h.registerCh:
      h.register(cli)
    case cli := <-h.unregisterCh:
      h.unregister(cli)
    case pushMsg := <-h.pushMsgCh:
      h.push(pushMsg)
    }
  }
}

func (h *Hub) register(cli *Client) {
  roomID := cli.roomID
  if _, ok := h.clientsPerRoom[roomID]; ok {
    h.clientsPerRoom[roomID][cli] = struct{}{}
    return
  }
  h.clientsPerRoom[roomID] = map[*Client]struct{}{cli: {}}
}

func (h *Hub) unregister(cli *Client) {
  roomID := cli.roomID
  if _, ok := h.clientsPerRoom[roomID][cli]; ok {
    delete(h.clientsPerRoom[roomID], cli)
  }
}
```

次に、`Pusher` インターフェースを満足するメソッドを生やします。

```go
func (h *Hub) Push(pushMsg *event.PushMessage) {
  h.pushMsgCh <- pushMsg
}

func (h *Hub) push(pushMsg *event.PushMessage) {
  for cli := range h.clientsPerRoom[pushMsg.RoomID] {
    cli.pushCh <- pushMsg.Msg
  }
}
```

`Push()` はchannelを通じてメッセージを送り、`Run()` で受け取って、各 `Client` で動いているgoroutineへチャネルを通じてメッセージを送ります。

`Hub` 側ではなく `Client` 側のgorutineでWebSocketコネクションへの書き込みを行っているのはデッドロックを回避するためです。

もし、WebSocketコネクションへの書き込みが失敗した場合、`unregisterCh` を通じて `Client` の登録解除を試みます。しかし、同じgoroutineで書き込みを行っている場合、`Hub` の `Run()` で動いているメインループは `h.push(pushMsg)` でブロックされており、`case cli := <-h.unregisterCh` で登録解除のメッセージを受け取ることはできません。

channelのバッファーのサイズを指定することでブロックせずキューに登録解除の通知を溜めることもできますが、キューが溢れたらデッドロックしてしまうことには変わりないです。いつ発生するか分からない恐怖に耐えるよりかは `Client` 側の別goroutineに処理を移譲した方が安心できます。



最後に、ハンドラーの処理と `Hub` のループをgoroutineで実行する処理を書きます。

```go
func (h *WebSocketHandler) WebSocket(c echo.Context) error {
  roomID := c.Param("id")

  wsConn, err := h.upgrader.Upgrade(c.Response(), c.Request(), nil)
  if err != nil {
    c.Logger().Errorf("upgrader.Upgrade: %v", err)
    return echo.NewHTTPError(http.StatusInternalServerError)
  }

  wsCli := ws.NewClient(roomID, wsConn, h.hub.UnregisterCh())
  h.hub.Register(wsCli)

  go wsCli.PushLoop()
  return nil
}
```

```go
func main() {
  // ...
  hub := ws.NewHub()
  go hub.Run()
  // ...
}
```

## この実装の辛み

これで実装は出来ているわけですが、ベストではないと考えています。

特に、`Client` の終了を `Hub` に伝える処理が微妙です。現在は `Hub` の `unregisterCh` を `Client` 側に渡していますが、`Hub` が管理しているchannelを送信可能状態(`chan<- T`)で外部公開するのに抵抗があります。

送信可能なchannel(`chan<- T`)を外部に公開すると、間違ってchannelを `close`される可能性があります。外部に公開するのは受信専用のchannel(`<-chan T`)にしておきたいところですが、そうすると `Client` 側で生成されたn個分のchannelを別途 `Hub` 側で管理する必要がありしんどいなぁと思っています。

良さげなアイデアがあればTwitterなりブコメなりで教えてくれると助かります。

## 感想

Goはgoroutineやchannelといった便利な機能がありますが、ソフトウェア・エンジニアリング的に「正しく使う」のは難しいなと思いました。


