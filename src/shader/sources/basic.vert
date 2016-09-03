#version 100

attribute vec3 position;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec4 cameraPosition;

#ifdef USE_COLOR
attribute vec4 aColor;
varying vec4 vColor;
#endif

#ifdef USE_MAIN_TEXTURE
attribute vec2 aMainTextureST;
varying vec2 vMainTextureST;
#endif

#ifdef OPEN_LIGHT
attribute vec3 aNormal;
varying vec3 vNormal;
#endif

void main (){
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

#ifdef USE_COLOR
    vColor = aColor;
#endif

#ifdef USE_MAIN_TEXTURE
    vMainTextureST = aMainTextureST;
#endif

}