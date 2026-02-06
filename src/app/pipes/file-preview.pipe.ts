import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filePreview',
  standalone: true,
  pure: true,
})
export class FilePreviewPipe implements PipeTransform {
  transform(value: File | string | null): string | null {
    if (!value) return null;

    if (typeof value === 'string') {
      return value;
    }

    if (value instanceof File) {
      return URL.createObjectURL(value);
    }

    return null;
  }
}
