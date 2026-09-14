import { createClient } from 'honox/client'
import { setupPreferredSourceButtons } from './lib/preferred-source'
import { setupTocHighlight } from './lib/toc-highlight'
import { setupTwitterEmbeds } from './lib/twitter-embed'

createClient()
setupTwitterEmbeds()
setupTocHighlight()
setupPreferredSourceButtons()
