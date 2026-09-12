import { createClient } from 'honox/client'
import { setupTocHighlight } from './lib/toc-highlight'
import { setupTwitterEmbeds } from './lib/twitter-embed'

createClient()
setupTwitterEmbeds()
setupTocHighlight()
