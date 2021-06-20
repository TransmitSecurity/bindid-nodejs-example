/**
 * This piece of code simply detects if the app runs in an iframe or not and apply some logic accordingly
 */
if (window.top !== window.self) {
  // we are in the iframe
  if (document.getElementById("loginBttonContainer"))
    document.getElementById("loginBttonContainer").remove();
} else {
  // not an iframe
  if (document.getElementById("iframeAlert"))
    document.getElementById("iframeAlert").remove();
}