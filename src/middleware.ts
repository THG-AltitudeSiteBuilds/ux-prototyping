import { sequence } from 'astro:middleware'

import blockImageRequests from './middlewares/block-image-requests'

export const onRequest = sequence(blockImageRequests)