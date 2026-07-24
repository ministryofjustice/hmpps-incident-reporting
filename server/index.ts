import createApp from './app'
import { services } from './services'

export const app = createApp(services())
