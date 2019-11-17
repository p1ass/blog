---
title: "改めてGoのdatabase/sqlラッパーに何を求めるのか考える"
date: 2019-11-09T00:00:00+09:00
draft: false
description: Goのdatabase/sqlパッケージは標準ライブラリとして必要な機能を提供していますが、欲しい機能がなく、サードパーティのライブラリを使うことがあります。ではそのライブラリをどのように選べばいいのでしょうか？この記事では、Goでデータベースをアクセスするときに何を求めるのかを考えつつ、sqlx、gorm、gorpを比較していきます。
categories:
- 開発
tags:
- Go
- MySQL
eyecatch: /posts/go-database-sql-wrapper/ogp.jpg
share: true
---

この記事は{{< link href="https://qiita.com/advent-calendar/2019/go5" text="Go5 Advent Calendar 2019" >}}の1日目の記事です。

## はじめに

Go のメジャーバージョンはいつの間にか5まで到達していたようですね、[@p1ass](https://twitter.com/p1ass)です。

Goでデータベースにアクセスするときに使うライブラリは{{< link href="https://golang.org/pkg/database/sql/" text="database/sql" >}}やそれをラップした{{< link href="https://github.com/jmoiron/sqlx" text="sqlx">}},{{< link href="https://github.com/jinzhu/gorm" text="gorm">}},{{< link href="https://github.com/go-gorp/gorp" text="gorp">}}など様々なライブラリがありますが、皆さんはどのライブラリを使っていますか？

おそらく様々な理由があってどれか(ここに挙げられていないものかもしれない)を使っているでしょう。
しかし、それは本当にベストな選択だったのでしょうか？

この記事では、Goでデータベースをアクセスするときに何を求めるのかを考えつつ、上に挙げた4つのライブラリについて考えていきます。
あくまでこの記事で述べるのは僕個人の意見ですが、この記事を通して皆さんが改めてライブラリ選定を考えるきっかけになれば幸いです。

<!--more-->

## database/sql の役割を知る

Go には{{< link href="https://golang.org/pkg/database/sql/" text="database/sql" >}}という標準ライブラリが存在します。
ここでは改めて database/sql の役割を見ます。

{{< link href="https://golang.org/pkg/database/sql/" text="godoc" >}}には以下のように書かれています。

> Package sql provides a generic interface around SQL (or SQL-like) databases.
> The sql package must be used in conjunction with a database driver. See https://golang.org/s/sqldrivers for a list of drivers.

database/sql は SQL に関する汎用的な機能を提供してます。
コネクションの管理や、クエリの発行、トランザクションなどが当たります。

また、データベースの違いによる差異を吸収するために{{< link href="https://golang.org/pkg/database/sql/driver/" text="database/sql/driver" >}}にインターフェイスが定義されていて、これを実装することで、どのデータベースに対しても内部的に同じAPIでアクセスすることができるようになっています。
Driver の実装は golang/go の{{< link href="https://github.com/golang/go/wiki/SQLDrivers" text="wiki" >}}にまとまっていてます。

Driver は blank import で `init` 関数が呼び出され、 `sql.Register` 関数が実行されることで、 database/sql に Driver が登録され、それ以降はどのデータベースに接続されているかをほとんど意識せずにコードが書くことができます。

{{< highlight Go >}}
func init() {
	sql.Register("mysql", &MySQLDriver{})
}
{{< /highlight >}}

{{< ex-link url="https://github.com/go-sql-driver/mysql/blob/578c4c8066964679ef44f45de2b6c7e811cc665e/driver.go" >}}

つまり、database/sql は抽象化されたAPIを提供することで、開発者がデータベースの差異を意識する必要がないように設計された標準ライブラリなのです。

## database/sqlに足りないものは?

とはいえ、database/sql は決してリッチなライブラリではありません。

Goの設計思想の中に{{< link href="https://talks.golang.org/2015/simplicity-is-complicated.slide" text="Simplicity" >}}があるように、他の言語とは違い多くの機能を標準で提供していません。

例えば、database/sql ではスキャンしたデータを構造体にマッピングする機能はありません。マッピングするにはスキャンしたデータ一つ一つごとに引数でを渡す必要があります。

{{< highlight go>}}
rows, err := db.Query("SELECT * FROM users LIMIT 10")
if err != nil {
  log.Println(err)
  os.Exit(1)
}
defer rows.Close()

type user struct{
  ID int32
  Name string
}

var us []*user

for rows.Next() {
  u := &user{}
  if err := rows.Scan(&u.ID, &u.Name); err != nil {
    log.Println(err)
    os.Exit(1)
  }
  us = append(us,u)
}
{{< /highlight >}}

勿論これでもデータベースからデータも持ってくるという役割を果たせており、標準ライブラリとしては必要な機能を提供しています。

しかし、実際に使う上では、少々面倒くさいと感じる人が多いと思います。そういった場合はサードパーティのライブラリを使用します。

## 我々がサードパーティのライブラリに求めるもの

それでは、サードパーティのライブラリにどのような機能を求めているでしょうか？
いくつか考えられるものを挙げてみました。

- 構造体へのマッピング
- 学習コストが低い
- 素のSQLを書きたい or 書きたくない

１つ目の「構造体へのマッピング」は上で述べた通りです。Goでdatabase/sqlラッパーを使う理由では最も大きいものではないでしょうか？
これはsqlx, gorm, gorp全てで提供されています、

2つ目の「学習コストが低い」はライブラリ選定で一般的に言えることだと思います。
Active Recordのような学習コストが高いが高機能を提供するライブラリも存在しますが、Goらしくないという理由で却下される場合が多いように感じます。

3つ目の「素のSQLを書きたい or 書きたくない」は2つ目とも関連してくる内容です。
SQLはアプリケーションで使われているプログラミング言語に囚われることなく使えます。そのため、今までJavaを書いていた人がGoのアプリケーションを開発することになっても、SQLの知識はそのまま転用できます。
特に複雑なクエリを発行する際にはSQLを直接書いたほうが見通しがよく、インデックスが効かないなどのパフォーマンス上の問題がおきにくいでしょう。

高機能なライブラリではメソッドチェーンなどを用いて、SQLを意識せずにクエリを発行できるようになっています。これは一度覚えてしまえば非常に便利に使うことができますが、SQLの知識をそのまま転用することはできず、ライブラリの学習コストが発生します。
とはいえ、SQLを書くのが面倒くさいと感じる人がいるのも事実です。

「学習コスト」と「利便性」をどちらを選ぶかは非常に難しい問題です。
そこで、一歩踏み込んでどんな場合はSQLを書いたほうが良いのかについて考えてみましょう。

## 本当に全てのSQLを書きたいのか？

ここでは基本的なCRUDのSQLをdatabase/sqlにならって QueryとExecに分けて考えます。
Queryは副作用のないSELECT、Execは副作用のあるINSERTや、UPDATE、DELETEに当たります。

### Query

Query、すなわちSELECT文は往々にして複雑になりがちです。
複数テーブルのJOINやWHERE、GROUP BYなどを使用いているとだんだん複雑になってきます。

これをメソッドチェーンで実装するとパット見で正しいクエリが発行できているのか分からず、これなら最初からSQLを書いたほうが良かったんじゃないかと思うようになります。

そのため、私はSELECTはそのままSQLを書く方が良いと考えています。

### Exec

それではExec系はどうでしょうか？

Exec系は単純になりがちです。構造体で持っているフィールドをそのままDBに反映させるだけであり、特に複雑ではありません。
しかし、テーブルのカラムが多い場合、INSERTやUPDATEのSQLを書くのは正直面倒くさいです。
これをdatabase/sqlラッパー側で隠蔽してしまっても、合計3つの関数を覚えるだけで良いので、ほとんど学習コストは増えません。

そのため、Exec系はdatabase/sqlラッパー側にまかせてしまった方が良いと考えています。

まとめると、SQLを書きたいと思うのはSELECTのみであって、他はよしなにやってほしいのです。

## 3つのライブラリを比較する

以上の議論を踏まえて、{{< link href="https://github.com/jmoiron/sqlx" text="sqlx">}},{{< link href="https://github.com/jinzhu/gorm" text="gorm">}},{{< link href="https://github.com/go-gorp/gorp" text="gorp">}}の3つのライブラリを比較してみましょう。

### sqlx

{{< ex-link url="https://github.com/jmoiron/sqlx" >}}

sqlxは非常に軽量なdatabase/sqlラッパーです。後述する2つよりは機能は少ないですが、構造体へのマッピングや名前付きパラメータに対応しています。軽量ということで、基本的にSQLはQuery、Exec問わず書く必要があります。

{{< highlight go>}}
type Person struct {
    FirstName string `db:"first_name"`
    LastName  string `db:"last_name"`
    Email     string `db:"email"`
}

db, _ := sqlx.Connect("sqlite3", "test.db")

people := []Person{}
db.Select(&people, "SELECT * FROM person ORDER BY first_name ASC")

db.NamedExec("INSERT INTO person (first_name, last_name, email) VALUES (:first_name, :last_name, :email)", &Person{"Jane", "Citizen", "jane.citzen@example.com"})
{{< /highlight >}}

SQLは全部手で書きたいんだ！という人にオススメです。また、database/sqlとAPIがそのまま使えるのも良いポイントです。

私は、Execはライブラリ側でやってほしいので、使うのをやめました。

### gorm

{{< ex-link url="https://github.com/jinzhu/gorm" >}}

gormはsqlxとは対照的に高機能なライブラリです。公式で `Full-Featured ORM (almost)` を謳っていたりします(GoでORMという単語が正しいのかは議論の対象外とします)。
特にRuby on Railsなどを使ってた人がGoを書く時に使う印象があります。

Queryはメソッドチェーンで記述することができ、Execも関数を呼び出すことででき、SQLを書く必要はなりません。

{{< highlight go>}}
type Person struct {
    FirstName string `gorm:"first_name"`
    LastName  string `gorm:"last_name"`
    Email     string `gorm:"email"`
}

db, err := gorm.Open("sqlite3", "test.db")

people := []Person{}
db.Order("first_name asc").Find(&people)

db.Create(&Person{"Jane", "Citizen", "jane.citzen@example.com"})
{{< /highlight >}}

なお、QueryでSQLを書くことも可能です。

{{< highlight go>}}
type Result struct {
  Name string
  Age  int
}

var result Result
db.Raw("SELECT name, age FROM users WHERE name = ?", 3).Scan(&result)
{{< /highlight >}}

gormはQueryはSQLで、Execはライブラリ側で行うように記述することができるため、私の考えるSQLを書くべきかどうかの考えを適用することができます。

しかし、SQLを書くことはあくまでオプションとして用意されているに過ぎず、複数人開発となると、SQLを書かない人も出てきて、ものによってSQLが書かれているものと書かれていないものの2種類が存在する可能性がありました。

そのため、gormも見送ることになりました。


### gorp

{{< ex-link url="https://github.com/go-gorp/gorp" >}}

最後はgorpです。

gorpは先の2つの中間に当たるライブラリです。QueryはデフォルトでSQLを書く仕様になっていますが、Execはライブラリ側がAPIを用意しています。

{{< highlight go>}}
type Person struct {
    FirstName string `db:"first_name"`
    LastName  string `db:"last_name"`
    Email     string `db:"email"`
}

db, err := sql.Open("sqlite3", "test.db")
dbmap := &gorp.DbMap{Db: db, Dialect: gorp.SqliteDialect{}}
dbmap.AddTableWithName(Person{}, "person").SetKeys(true, "email")

var people []Person
_, err = dbmap.Select(&posts, "SELECT * FROM person ORDER BY first_name ASC")

err = dbmap.Insert(&Person{"Jane", "Citizen", "jane.citzen@example.com"})
{{< /highlight >}}

この仕様は私が求めていたものに一致しています。
Execの為にテーブルとの関連付け用の関数 `AddTableWithName` を呼ぶ必要がありますが、大した問題にはならないでしょう。

今現在はgorpを主に使って開発を行っています。

## まとめ

私が考える database/sqlラッパーに求めるものは、

- 構造体へのマッピング
- 学習コストが低い
- QueryはSQLを書きたい
- ExecはSQLを書きたくない

の4つでした。

この4つの要件を満たすラッパーはgorpでした。
勿論他にもラッパーライブラリは存在しますが、この要件を満たしつつ、有名な(Starが多い)ライブラリはないのではないでしょうか。

今回は私個人の考えから、どのライブラリが適切かを考えましたが、人によって求めるものは異なると思うので、今一度自分が何も求めるか考えてみると良いかもしれません。

明日の{{< link href="https://qiita.com/advent-calendar/2019/go5" text="Go5 Advent Calendar 2019" >}}の2日目はsoichisumiさん記事になります。お楽しみに。

## 合わせて読みたい

{{< ex-link url="https://blog.p1ass.com/posts/go-con/" >}}
