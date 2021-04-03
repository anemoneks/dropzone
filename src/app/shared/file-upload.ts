import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class FileUpload {
  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
