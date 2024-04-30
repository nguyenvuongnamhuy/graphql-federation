import { Metadata } from '@grpc/grpc-js';
type MetadataValue = string | Buffer;
/**
 * Array of keys have special characters need to encode.
 */
const specialKeys = ['email'];

/**
 * An extended class from Metadata class. Support for encode/decode utf8 key data
 */
export class MetadataEx extends Metadata {
  override add(key: string, value: MetadataValue): void {
    if (specialKeys.indexOf(key) > -1) value = Buffer.from(value).toString('base64');
    super.add(key, value);
  }
}

Metadata.prototype.get = function get(key: string): MetadataValue[] {
  const internalRepr = this.toHttp2Headers();
  const values = (internalRepr[key.toLowerCase()] as MetadataValue[]) ?? [];
  if (specialKeys.includes(key)) {
    return values.map((value) => Buffer.from(value as string, 'base64').toString('utf8'));
  }
  return values;
};
