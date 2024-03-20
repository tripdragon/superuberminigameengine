export function requestCORSIfNotSameOrigin(img, url) {
  if ((new URL(url, window.location.href)).origin !== window.location.origin) {
    img.crossOrigin = "";
  }
}

export function loadImage(src){
  const _texture = this.texture;
  // Asynchronously load an image
  var image = new Image();
  const gl = this.gl;
  // image.src = "http://localhost:8001/sprites/NFT_gradprix_uponcat.png";
  image.src = src;
  image.addEventListener('load', function() {
    // Now that the image has loaded make copy it to the texture.
    gl.bindTexture(gl.TEXTURE_2D, _texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
  });
}
