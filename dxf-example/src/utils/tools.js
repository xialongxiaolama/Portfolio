/**
 * @description: 将base64转换为Blob对象
 * @param {String} mimeType 文件类型
 * @param {Base64} base64 base64文件
 * @return {Blob} 返回Blob 对象
 */
function createBlobFromBase64(mimeType, base64){
  const binary = atob(base64);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }
  
  const blob = new Blob([array], { type: mimeType });
  return blob;
}