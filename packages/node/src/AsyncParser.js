import { Readable } from 'stream';
import JSON2CSVNodeTransform from './Transform.js';

export default class JSON2CSVNodeAsyncParser {
  constructor(opts, transformOpts) {
    this.opts = opts;
    this.transformOpts = transformOpts;
  }

  /**
   * Main function that converts json to csv.
   *
   * @param {Stream|Array|Object} data Array of JSON objects to be converted to CSV
   * @returns {Stream} A stream producing the CSV formated data as a string
   */
  parse(data) {
    if (typeof data === 'string' || ArrayBuffer.isView(data)) {
      data = Readable.from(data, { objectMode: false });
    } else if (Array.isArray(data)) {
      data = Readable.from(data.filter((item) => item !== null));
    } else if (typeof data === 'object' && !(data instanceof Readable)) {
      data = Readable.from([data]);
    }

    if (!(data instanceof Readable)) {
      throw new Error(
        'Data should be a JSON object, JSON array, typed array, string or stream'
      );
    }

    return data.pipe(
      new JSON2CSVNodeTransform(this.opts, {
        objectMode: data.readableObjectMode,
        ...this.transformOpts,
      })
    );
  }
}
