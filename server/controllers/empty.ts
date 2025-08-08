import { BaseController } from './base'

// NB: this only exists to avoid using HMPO’s default controller until it supports express 5
// TODO: once hmpo-form-wizard supports express 5, remove this class
export class EmptyController extends BaseController {}
