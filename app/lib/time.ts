import { parse } from '@formkit/tempo'

export const parseDate = (str: string) => {
  return parse(str, 'YYYY-MM-DDTHH:mm:ss', 'Asia/Tokyo')
}
