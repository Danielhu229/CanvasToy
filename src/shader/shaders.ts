// Warning: this file is automaticaly generated by util/glslLoader.js and executed by nodejs
/* tslint:disable:variable-name max-line-length no-trailing-whitespace*/
export namespace ShaderSource {
        export const calculators__blur__gaussian_glsl = `
vec4 gaussian_blur(sampler2D origin, vec2 uv, float blurStep, vec2 blurDir) {
    vec4 average = vec4(0.0, 0.0, 0.0, 0.0);
    average += texture2D(origin, uv - 4.0 * blurStep * blurDir) * 0.0162162162;
    average += texture2D(origin, uv - 3.0 * blurStep * blurDir) * 0.0540540541;
    average += texture2D(origin, uv - 2.0 * blurStep * blurDir) * 0.1216216216;
    average += texture2D(origin, uv - 1.0 * blurStep * blurDir) * 0.1945945946;
    average += texture2D(origin, uv) * 0.2270270270;
    average += texture2D(origin, uv + 1.0 * blurStep * blurDir) * 0.1945945946;
    average += texture2D(origin, uv + 2.0 * blurStep * blurDir) * 0.1216216216;
    average += texture2D(origin, uv + 3.0 * blurStep * blurDir) * 0.0540540541;
    average += texture2D(origin, uv + 4.0 * blurStep * blurDir) * 0.0162162162;
    return average;
}
`;
        export const calculators__blur__gaussian_log_glsl = `

`;
        export const calculators__linearlize_depth_glsl = `
float linearlizeDepth(float far, float near, float depth) {
    float NDRDepth = depth * 2.0 - 1.0;;
    return 2.0 * near / (near + far - NDRDepth * (far - near));
}
`;
        export const calculators__packFloat1x32_glsl = `
vec4 packFloat1x32(float val)
{
    vec4 pack = vec4(1.0, 255.0, 65025.0, 16581375.0) * val;
    pack = fract(pack);
    pack -= vec4(pack.yzw / 255.0, 0.0);
    return pack;
}
`;
        export const calculators__phong_glsl = `
vec3 calculateLight(
    vec3 position,
    vec3 normal,
    vec3 lightDir,
    vec3 eyePos,
    vec3 specularLight,
    vec3 diffuseLight,
    float shiness,
    float idensity
    ) {
    float lambortian = max(dot(lightDir, normal), 0.0);
    vec3 reflectDir = normalize(reflect(lightDir, normal));
    vec3 viewDir = normalize(eyePos - position);
    float specularAngle = max(dot(reflectDir, viewDir), 0.0);
    vec3 specularColor = specularLight * pow(specularAngle, shiness);
    vec3 diffuseColor = diffuse * lambortian;
    return (diffuseColor + specularColor) * idensity;
}
`;
        export const calculators__shadow_factor_glsl = `
#ifdef RECEIVE_SHADOW

vec4 texture2DbilinearEXP(sampler2D shadowMap, vec2 uv, float texelSize) {
    vec2 f = fract(uv / texelSize - 0.5);
    vec2 centroidUV = (floor(uv / texelSize - 0.5)) * texelSize;

    vec4 lb = texture2D(shadowMap, centroidUV + texelSize * vec2(0.0, 0.0));
    vec4 lt = texture2D(shadowMap, centroidUV + texelSize * vec2(0.0, 1.0));
    vec4 rb = texture2D(shadowMap, centroidUV + texelSize * vec2(1.0, 0.0));
    vec4 rt = texture2D(shadowMap, centroidUV + texelSize * vec2(1.0, 1.0));
    vec4 a = lb + log(mix(vec4(1.0), exp(lt - lb), f.y));
    vec4 b = rb + log(mix(vec4(1.0), exp(rt - rb), f.y));
    vec4 z = a + log(mix(vec4(1.0), exp(b - a), f.x));
    return z;
}

vec4 texture2Dbilinear(sampler2D shadowMap, vec2 uv, float texelSize) {
    vec2 f = fract(uv / texelSize - 0.5);
    vec2 centroidUV = (floor(uv / texelSize - 0.5)) * texelSize;

    vec4 lb = texture2D(shadowMap, centroidUV + texelSize * vec2(0.0, 0.0));
    vec4 lt = texture2D(shadowMap, centroidUV + texelSize * vec2(0.0, 1.0));
    vec4 rb = texture2D(shadowMap, centroidUV + texelSize * vec2(1.0, 0.0));
    vec4 rt = texture2D(shadowMap, centroidUV + texelSize * vec2(1.0, 1.0));
    vec4 a = mix(lb, lt, f.y);
    vec4 b = mix(rb, rt, f.y);
    vec4 z = mix(a, b, f.x);
    return z;
}

float texture2Dfilter(sampler2D shadowMap, vec2 uv, float texelSize) {
    vec2 info = texture2Dbilinear(shadowMap, uv, texelSize).xy;
    float base = info.r;
    float kernelSize = info.g;
    float sum = 0.0;
    for (int i = 0; i < FILTER_SIZE; ++i) {
        for (int j = 0; j < FILTER_SIZE; ++j) {
            vec2 subuv = uv + vec2(float(i) + 0.5 - float(FILTER_SIZE) / 2.0, float(j) + 0.5 - float(FILTER_SIZE) / 2.0) * texelSize * kernelSize;
            float z = texture2Dbilinear(shadowMap, subuv, texelSize).r;
            float expd = exp(z - base);
            sum += expd;
        }
    }
    sum /= float(FILTER_SIZE * FILTER_SIZE);
    return base + log(sum);
}

float pcf(sampler2D shadowMap, vec2 uv, float depth, float bias, float texelSize) {
    vec2 info = texture2Dbilinear(shadowMap, uv, texelSize).xy;
    float kernelSize = 1.0;
    float sum = 0.0;
    for (int i = 0; i < FILTER_SIZE; ++i) {
        for (int j = 0; j < FILTER_SIZE; ++j) {
            float z = texture2Dbilinear(shadowMap, uv + kernelSize * vec2(float(i) + 0.5 - float(FILTER_SIZE) / 2.0, float(j) + 0.5 - float(FILTER_SIZE) / 2.0).x * texelSize, texelSize).r;
            sum += step(depth - bias, z) / float(FILTER_SIZE * FILTER_SIZE);
        }
    }
    return sum;
}

float getSpotDirectionShadow(vec2 clipPos, sampler2D shadowMap, float linearDepth, float lambertian, float texelSize, int shadowLevel, float softness)
{
    if (shadowLevel == SHADOW_LEVEL_NONE) {
        return 1.0;
    } else {
        vec2 uv = clipPos * 0.5 + 0.5;
        float bias = clamp(0.2 * tan(acos(lambertian)), 0.0, 1.0);
        if (shadowLevel == SHADOW_LEVEL_HARD) {
            return step(linearDepth, texture2D(shadowMap, uv).r + bias);
        } else {
            float z = texture2DbilinearEXP(shadowMap, uv, texelSize).r;
            float s = exp(z - linearDepth * softness);
            return min(s, 1.0);
        }
    }
}

float getPointShadow(vec3 cubePos, samplerCube shadowMap, float linearDepth, float lambertian, float texelSize, int shadowLevel, float softness)
{
    float bias = clamp(0.2 * tan(acos(lambertian)), 0.0, 1.0);
    if (shadowLevel == SHADOW_LEVEL_NONE) {
        return 1.0;
    } else {
        // if (shadowLevel == SHADOW_LEVEL_HARD) {
            return step(linearDepth, textureCube(shadowMap, cubePos).r + bias);
        //else {
            // TODO: perform cubemap interpolation for soft-level shadow map for point light
        //}
    }
}

#endif
`;
        export const calculators__types_glsl = `
vec3 calculateDirLight(
    DirectLight light,
    Material material,
    vec3 position,
    vec3 normal,
    vec3 eyePos
    ) {
    return calculateLight(
        material,
        normalize(eyePos - position),
        normal,
        -light.direction,
        light.color,
        light.idensity
    );
}

vec3 calculatePointLight(
    PointLight light,
    Material material,
    vec3 position,
    vec3 normal,
    vec3 eyePos
    ) {
    float lightDis = length(light.position - position);
    lightDis /= light.radius;
    float atten_min = 1.0 / (light.constantAtten + light.linearAtten + light.squareAtten);
    float atten_max = 1.0 / light.constantAtten;
    float atten = 1.0 / (light.constantAtten + light.linearAtten * lightDis + light.squareAtten * lightDis * lightDis);
    float idensity = light.idensity * (atten - atten_min) / (atten_max - atten_min);
    idensity *= step(lightDis, 1.0);
    return calculateLight(
        material,
        normalize(eyePos - position),
        normal,
        normalize(light.position - position),
        light.color,
        idensity
    );
}

vec3 calculateSpotLight(
    SpotLight light,
    Material material,
    vec3 position,
    vec3 normal,
    vec3 eyePos
    ) {
    vec3 lightDir = normalize(light.position - position);
    float spotFactor = dot(-lightDir, light.spotDir);
    if (spotFactor < light.coneAngleCos) {
        return vec3(0.0);
    }
    float lightDis = length(light.position - position);
    lightDis /= light.radius;
    float atten_min = 1.0 / (light.constantAtten + light.linearAtten + light.squareAtten);
    float atten_max = 1.0 / light.constantAtten;
    float atten = 1.0 / (light.constantAtten + light.linearAtten * lightDis + light.squareAtten * lightDis * lightDis);
    float idensity = light.idensity * (atten - atten_min) / (atten_max - atten_min);
    
    idensity *= (spotFactor - light.coneAngleCos) / (1.0 - light.coneAngleCos);
    // idensity *= step(light.radius, lightDis);
    return calculateLight(
        material,
        normalize(eyePos - position),
        normal,
        lightDir,
        light.color,
        idensity
    );
}
`;
        export const calculators__unpackFloat1x32_glsl = `
float unpackFloat1x32( vec4 rgba ) {
  return dot( rgba, vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 160581375.0) );
}
`;
        export const debug__checkBox_glsl = `
float checkerBoard(in vec2 uv, in float subSize) {
    vec2 bigBox = mod(uv, vec2(subSize * 2.0));
    return (
        step(subSize, bigBox.x) * step(subSize, bigBox.y)
        + step(subSize, subSize * 2.0 -bigBox.x) * step(subSize, subSize * 2.0 -bigBox.y)
    );
}
`;
        export const definitions__light_glsl = `
#define SHADOW_LEVEL_NONE 0
#define SHADOW_LEVEL_HARD 1
#define SHADOW_LEVEL_SOFT 2
#define SHADOW_LEVEL_PCSS 3

struct Light {
  vec3 color;
  float idensity;
  vec3 direction;
#ifdef RECEIVE_SHADOW
  lowp int shadowLevel;
  float softness;
  float shadowMapSize;
  mat4 projectionMatrix;
  mat4 viewMatrix;
#endif
};

struct DirectLight {
  vec3 color;
  float idensity;
  vec3 direction;
#ifdef RECEIVE_SHADOW
  lowp int shadowLevel;
  float softness;
  float shadowMapSize;
  mat4 projectionMatrix;
  mat4 viewMatrix;
#endif
};

struct PointLight {
  vec3 color;
  float idensity;
  float radius;
  vec3 position;
  float squareAtten;
  float linearAtten;
  float constantAtten;
#ifdef RECEIVE_SHADOW
  lowp int shadowLevel;
  float softness;
  float shadowMapSize;
  mat4 projectionMatrix;
  mat4 viewMatrix;
  float pcssArea;
#endif
};

struct SpotLight {
  vec3 color;
  float idensity;
  float radius;
  vec3 position;
  float squareAtten;
  float linearAtten;
  float constantAtten;
  float coneAngleCos;
  vec3 spotDir;
#ifdef RECEIVE_SHADOW
  lowp int shadowLevel;
  float softness;
  float shadowMapSize;
  mat4 projectionMatrix;
  mat4 viewMatrix;
  float pcssArea;
#endif
};
`;
        export const definitions__material_blinnphong_glsl = `
struct Material {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float specularExponent;
    float reflectivity;
};`;
        export const definitions__material_pbs_glsl = `
struct Material {
    vec3 ambient;
    vec3 albedo;
    float metallic;
    float roughness;
};`;
        export const interploters__deferred__geometry_frag = `
uniform Material uMaterial;

uniform vec3 eyePos;
varying vec3 vNormal;

#ifdef _MAIN_TEXTURE
uniform sampler2D uMainTexture;
varying vec2 vMainUV;
#endif

#ifdef _NORMAL_TEXTURE
uniform sampler2D uNormalTexture;
varying vec2 vNormalUV;
#endif

void main () {
    vec3 normal = normalize(vNormal);
#ifdef _NORMAL_TEXTURE
    gl_FragData[0] = vec4(normal, uMaterial.roughness);
#else
    gl_FragData[0] = vec4(normal, uMaterial.roughness);
#endif
#ifdef _MAIN_TEXTURE
    gl_FragData[1] = vec4(uMaterial.albedo * texture2D(uMainTexture, vMainUV).xyz, uMaterial.metallic);
#else
    gl_FragData[1] = vec4(uMaterial.albedo, uMaterial.metallic);
#endif
    // save 32 bit depth to render target 3
    gl_FragData[2] =  packFloat1x32(gl_FragCoord.z);
}
`;
        export const interploters__deferred__geometry_vert = `
attribute vec3 position;
uniform mat4 modelViewProjectionMatrix;

#ifdef _MAIN_TEXTURE
attribute vec2 aMainUV;
varying vec2 vMainUV;
#endif

uniform mat4 normalViewMatrix;
attribute vec3 aNormal;
varying vec3 vNormal;

void main (){
    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);
    vNormal = (normalViewMatrix * vec4(aNormal, 1.0)).xyz;

#ifdef _MAIN_TEXTURE
    vMainUV = aMainUV;
#endif
}
`;
        export const interploters__deferred__tiledLight_vert = `
attribute vec3 position;
varying vec3 vPosition;

void main()
{
    gl_Position = vec4(position, 1.0);
    vPosition = position;
}
`;
        export const interploters__deferred__tiledLightPoint_frag = `
#define MAX_TILE_LIGHT_NUM 32

precision highp float;

uniform float uHorizontalTileNum;
uniform float uVerticalTileNum;
uniform float uLightListLengthSqrt;

uniform mat4 inverseProjection;

uniform sampler2D uLightIndex;
uniform sampler2D uLightOffsetCount;
uniform sampler2D uLightPositionRadius;
uniform sampler2D uLightColorIdensity;

uniform sampler2D normalRoughnessTex;
uniform sampler2D albedoMetallicTex;
uniform sampler2D depthTex;

uniform float cameraNear;
uniform float cameraFar;


varying vec3 vPosition;

vec3 decodeNormal(vec2 n)
{
   vec3 normal;
   normal.z = dot(n, n) * 2.0 - 1.0;
   normal.xy = normalize(n) * sqrt(1.0 - normal.z * normal.z);
   return normal;
}

vec3 decodePosition(float depth) {
    vec4 clipSpace = vec4(vPosition.xy, depth * 2.0 - 1.0, 1.0);
    vec4 homogenous = inverseProjection * clipSpace;
    return homogenous.xyz / homogenous.w;
}

void main() {
    vec2 uv = vPosition.xy * 0.5 + vec2(0.5);
    vec2 gridIndex = uv ;// floor(uv * vec2(uHorizontalTileNum, uVerticalTileNum)) / vec2(uHorizontalTileNum, uVerticalTileNum);
    vec4 lightIndexInfo = texture2D(uLightOffsetCount, gridIndex);
    float lightStartIndex = lightIndexInfo.r;
    float lightNum = lightIndexInfo.w;
    vec4 tex1 = texture2D(normalRoughnessTex, uv);
    vec4 tex2 = texture2D(albedoMetallicTex, uv);

    vec3 normal = tex1.xyz;
    Material material;
    material.roughness = tex1.w;
    material.albedo = tex2.xyz;
    float depth = unpackFloat1x32(texture2D(depthTex, uv));
    vec3 viewPosition = decodePosition(depth);
    vec3 totalColor = vec3(0.0);
    int realCount = 0;
    for(int i = 0; i < MAX_TILE_LIGHT_NUM; i++) {
        if (float(i) > lightNum - 0.5) {
            break;
        }
        // float listX = (float(lightStartIndex + i) - listX_int * uLightListLengthSqrt) / uLightListLengthSqrt;
        // float listY = ((lightStartIndex + i) / uLightListLengthSqrt) / uLightListLengthSqrt;
        // float listX = (mod(lightStartIndex + i, uLightListLengthSqrt)) / uLightListLengthSqrt;
        // listX = 1.0;
        // listY = 0.0;
        float fixlightId = texture2D(uLightIndex, vec2((lightStartIndex + float(i)) / uLightListLengthSqrt, 0.5)).x;
        vec4 lightPosR = texture2D(uLightPositionRadius, vec2(fixlightId, 0.5));
        vec3 lightPos = lightPosR.xyz;
        float lightR = lightPosR.w;
        vec4 lightColorIden = texture2D(uLightColorIdensity, vec2(fixlightId, 0.5));
        vec3 lightColor = lightColorIden.xyz;
        float lightIdensity = lightColorIden.w;
        vec3 lightDir = normalize(lightPos - viewPosition);

        float dist = distance(lightPos, viewPosition);
        if (dist < lightR) {
            realCount++;
            vec3 fixLightColor = lightColor * min(1.0,  1.0 / (dist * dist ) / (lightR * lightR));
            totalColor += calculateLight(
                material,
                normalize(-viewPosition),
                normal,
                lightDir,
                lightColor,
                lightIdensity
            );
            // totalColor += vec3(listX, listY, 0.0);
        }
    }
    // vec3 depth = vec3(linearlizeDepth(cameraFar, cameraNear, tex1.z));
    // vec3 depth = vec3(tex1.z);
    vec3 test = vec3(float(realCount) / 32.0);
    gl_FragColor = vec4(totalColor, 1.0);
}
`;
        export const interploters__forward__esm__depth_frag = `
uniform float softness;
varying vec3 viewPos;

void main () {
    float d = length(viewPos);
    gl_FragColor.r = d * softness;
    gl_FragColor.g = exp(d) * d;
}
`;
        export const interploters__forward__esm__depth_vert = `
attribute vec3 position;
uniform mat4 modelViewProjectionMatrix;
uniform mat4 modelViewMatrix;
varying vec3 viewPos;

void main () {
    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);
    viewPos = (modelViewMatrix * vec4(position, 1.0)).xyz;
}
`;
        export const interploters__forward__esm__prefiltering_frag = `
uniform sampler2D uOrigin;
uniform vec2 uBlurDir;
uniform float uBlurStep;

uniform float lightArea;

varying vec2 uv;

void main () {
    float base = texture2D(uOrigin, uv).r;
    float block = 0.0;

    for (int i = 0; i < BLOCK_SIZE; ++i) {
        for (int j = 0; j < BLOCK_SIZE; ++j) {
            float d = texture2D(uOrigin, uv + vec2(float(i - BLOCK_SIZE / 2) + 0.5, float(j - BLOCK_SIZE / 2) + 0.5) * uBlurStep).r;
            block += step(base, d) * d / float(BLOCK_SIZE * BLOCK_SIZE);
        }
    }
    
    float kenelSize = min(4.0, lightArea * (base - block) / base);
    float stepSize = kenelSize / float(FILTER_SIZE);

    float sum = 0.0;

    for (int i = 0; i < FILTER_SIZE; ++i) {
        for (int j = 0; j < FILTER_SIZE; ++j) {
            float d = texture2D(uOrigin, 
            uv + stepSize * vec2(float(i - FILTER_SIZE / 2) + 0.5, float(j - FILTER_SIZE / 2) + 0.5) * uBlurStep).r;
            sum += exp(d - base) / float(FILTER_SIZE * FILTER_SIZE);
        }
    }

    float average = log(sum) + base;

    gl_FragColor.r = average;
    gl_FragColor.g = kenelSize;
}
`;
        export const interploters__forward__esm__prefiltering_vert = `
uniform mat4 normalMatrix;
attribute vec3 position;
attribute vec3 normal;
varying vec2 uv;
varying vec3 vNormal;

void main () {
    gl_Position = vec4(position, 1.0);
    uv = gl_Position.xy * 0.5 + 0.5;
    vNormal = normalize((normalMatrix * vec4(normal, 1.0)).xyz);
}
`;
        export const interploters__forward__gouraud_frag = `
attribute vec3 position;
uniform mat4 modelViewProjectionMatrix;

void main() {
    textureColor = colorOrMainTexture(vMainUV);
#ifdef OPEN_LIGHT
    totalLighting = ambient;
    vec3 normal = normalize(vNormal);
    gl_FragColor = vec4(totalLighting, 1.0);
#else
#ifdef USE_COLOR
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
#endif
#endif
#ifdef _MAIN_TEXTURE
    gl_FragColor = gl_FragColor * textureColor;
#endif
#ifdef USE_COLOR
    gl_FragColor = gl_FragColor * color;
#endif
}
`;
        export const interploters__forward__gouraud_vert = `
attribute vec3 position;
uniform mat4 modelViewProjectionMatrix;

attribute vec2 aMainUV;
varying vec2 vMainUV;

void main (){
    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);
#ifdef OPEN_LIGHT
    vec3 normal = (normalMatrix * vec4(aNormal, 0.0)).xyz;
    totalLighting = ambient;
    normal = normalize(normal);
    for (int index = 0; index < LIGHT_NUM; index++) {
        totalLighting += calculate_light(gl_Position, normal, lights[index].position, eyePos, lights[index].specular, lights[index].diffuse, 4, lights[index].idensity);
    }
    vLightColor = totalLighting;
#endif
#ifdef _MAIN_TEXTURE
    vTextureCoord = aTextureCoord;
#endif
}
`;
        export const interploters__forward__phong_frag = `
uniform Material uMaterial;
uniform vec3 cameraPos;

varying vec2 vMainUV;
varying vec4 clipPos;

varying vec3 vNormal;
varying vec3 vPosition;

#ifdef _MAIN_TEXTURE
uniform sampler2D uMainTexture;
#endif

#ifdef _ENVIRONMENT_MAP
uniform float reflectivity;
uniform samplerCube uCubeTexture;
#endif

#if (directLightsNum > 0)
uniform DirectLight directLights[directLightsNum];
uniform sampler2D directLightShadowMap[directLightsNum];
#endif

#if (pointLightsNum > 0)
uniform PointLight pointLights[pointLightsNum];
uniform samplerCube pointLightShadowMap[pointLightsNum];
#endif

#if (spotLightsNum > 0)
uniform SpotLight spotLights[spotLightsNum];
uniform sampler2D spotLightShadowMap[spotLightsNum];
#endif

#ifdef RECEIVE_SHADOW

    #if (directLightsNum > 0)
    varying vec4 directShadowCoord[directLightsNum];
    varying float directLightDepth[directLightsNum];
    #endif

    #if (spotLightsNum > 0)
    varying vec4 spotShadowCoord[spotLightsNum];
    varying float spotLightDepth[spotLightsNum];
    #endif

#endif

void main () {

#ifdef _MAIN_TEXTURE
    gl_FragColor = texture2D(uMainTexture, vMainUV);
#else
    #ifdef _DEBUG
    gl_FragColor = vec4(vec3(checkerBoard(vMainUV, 0.1)), 1.0);
    #else
    gl_FragColor = vec4(1.0);
    #endif
#endif
    vec3 color = vec3(0.0);
    vec3 normal = normalize(vNormal);
    vec3 totalLighting = uMaterial.ambient;
    #ifdef _ENVIRONMENT_MAP
    vec3 viewDir = normalize(vPosition - cameraPos);
    vec3 skyUV = normalize(reflect(viewDir, vNormal));
    vec3 imageLightColor = textureCube(uCubeTexture, skyUV).xyz;
    color += calculateImageBasedLight(uMaterial, skyUV, normal, viewDir, imageLightColor, vec3(0.5));
    #endif
#if (directLightsNum > 0)
    for (int index = 0; index < directLightsNum; index++) {
        vec3 lighting = calculateDirLight(
            directLights[index],
            uMaterial,
            vPosition,
            normal,
            cameraPos
        );
    #ifdef RECEIVE_SHADOW
        float lambertian = dot(-directLights[index].direction, normal);
        float shadowFactor = getSpotDirectionShadow(
            directShadowCoord[index].xy / directShadowCoord[index].w, 
            directLightShadowMap[index], 
            directLightDepth[index], 
            lambertian, 
            1.0 / directLights[index].shadowMapSize,
            directLights[index].shadowLevel,
            directLights[index].softness
        );
        lighting *= shadowFactor;
    #endif
        totalLighting += lighting;
    }
#endif
#if (pointLightsNum > 0)
    for (int index = 0; index < pointLightsNum; index++) {
        vec3 lighting = calculatePointLight(
            pointLights[index],
            uMaterial,
            vPosition,
            normal,
            cameraPos
        );
        #ifdef RECEIVE_SHADOW
        vec3 offset = vPosition - pointLights[index].position;
        vec3 cubePos = normalize(offset);
        float linearDepth = length(offset);
        float lambertian = max(dot(-cubePos, normal), 0.0);
        float shadowFactor = getPointShadow(
            cubePos,
            pointLightShadowMap[index],
            linearDepth,
            lambertian,
            1.0 / pointLights[index].shadowMapSize,
            pointLights[index].shadowLevel,
            pointLights[index].softness
        );
        lighting *= shadowFactor;
        #endif
        totalLighting += lighting;
    }
#endif
#if (spotLightsNum > 0)
    for (int index = 0; index < spotLightsNum; index++) {
        vec3 lighting = calculateSpotLight(
            spotLights[index],
            uMaterial,
            vPosition,
            normal,
            cameraPos
        );
    #ifdef RECEIVE_SHADOW
        float lambertian = dot(-spotLights[index].spotDir, normal);
        float shadowFactor = getSpotDirectionShadow(
            spotShadowCoord[index].xy / spotShadowCoord[index].w, 
            spotLightShadowMap[index],
            spotLightDepth[index], 
            lambertian, 
            1.0 / spotLights[index].shadowMapSize,
            spotLights[index].shadowLevel,
            spotLights[index].softness
        );
        lighting *= shadowFactor;
    #endif
        totalLighting += lighting;

    }
#endif
    color += totalLighting;
    gl_FragColor *= vec4(color, 1.0);
}
`;
        export const interploters__forward__phong_vert = `
attribute vec3 position;
uniform mat4 modelViewProjectionMatrix;
uniform mat4 modelMatrix;

attribute vec2 aMainUV;
varying vec2 vMainUV;

uniform mat4 normalMatrix;
attribute vec3 aNormal;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec4 clipPos;


#if (directLightsNum > 0)
uniform DirectLight directLights[directLightsNum];
    #ifdef RECEIVE_SHADOW
    varying vec4 directShadowCoord[directLightsNum];
    varying float directLightDepth[directLightsNum];
    #endif
#endif

#if (spotLightsNum > 0)
uniform SpotLight spotLights[spotLightsNum];
    #ifdef RECEIVE_SHADOW
    varying vec4 spotShadowCoord[spotLightsNum];
    varying float spotLightDepth[spotLightsNum];
    #endif
#endif


void main (){
    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);
    clipPos = gl_Position;
    vec4 worldPos = (modelMatrix * vec4(position, 1.0));
    vPosition = worldPos.xyz;
    vNormal = (normalMatrix * vec4(aNormal, 1.0)).xyz;
    vMainUV = aMainUV;

    #ifdef RECEIVE_SHADOW
        #if (directLightsNum > 0)
        for (int i = 0; i < directLightsNum; ++i) {
            directShadowCoord[i] = directLights[i].projectionMatrix * directLights[i].viewMatrix * worldPos;
            directLightDepth[i] = length((directLights[i].viewMatrix * worldPos).xyz);
        }
        #endif

        #if (spotLightsNum > 0)
        for (int i = 0; i < spotLightsNum; ++i) {
            spotShadowCoord[i] = spotLights[i].projectionMatrix * spotLights[i].viewMatrix * worldPos;
            spotLightDepth[i] = length((spotLights[i].viewMatrix * worldPos).xyz);
        }
        #endif
    #endif
}
`;
        export const interploters__forward__skybox_frag = `
varying vec3 cubeUV;
uniform samplerCube uCubeTexture;
void main()
{
    gl_FragColor = textureCube(uCubeTexture, cubeUV);
}
`;
        export const interploters__forward__skybox_vert = `
attribute vec3 position;
uniform mat4 viewProjectionMatrix;
varying vec3 cubeUV;

void main (){
    vec4 mvp = viewProjectionMatrix * vec4(position, 1.0);
    cubeUV = position;
    gl_Position = mvp.xyww;
}
`;
        export const light_model__blinn_phong_glsl = `
vec3 calculateLight(
    Material material,
    vec3 viewDir,
    vec3 normal,
    vec3 lightDir,
    vec3 lightColor,
    float idensity
    ) {
    float lambortian = max(dot(lightDir, normal), 0.0);

    // replace R * V with N * H
    vec3 H = (lightDir + viewDir) / length(lightDir + viewDir);
    float specularAngle = max(dot(H, normal), 0.0);

    vec3 specularColor = material.specular * pow(specularAngle, material.specularExponent);
    vec3 diffuseColor = material.diffuse * lambortian;
    vec3 color = (diffuseColor + specularColor) * idensity * lightColor;
    return color;
}

vec3 calculateImageBasedLight(
    Material material,
    vec3 lightDir,
    vec3 normal,
    vec3 viewDir,
    vec3 specularColor,
    vec3 diffuseColor
) {
    
    vec3 color = mix(specularColor, diffuseColor, material.reflectivity);
    return color;
}
`;
        export const light_model__pbs_ggx_glsl = `
float tangent_2(float cos_2) {
    return (1. - cos_2) / cos_2;
}

float Smith_G1(float NdotV, float roughness) {
    float tan_2 = tangent_2(NdotV * NdotV);
    float root = roughness * roughness * tan_2;
    return 2.0 / (1. + sqrt(1. + root));
}

float GGX_D(float HdotN, float roughness) {
    float cos_2 = HdotN * HdotN;
    float tan_2 = tangent_2(cos_2);

    float root = roughness / (cos_2 * (roughness * roughness + tan_2));
    return root * root / acos(-1.);
}

vec3 calculateLight(
    Material material,
    vec3 viewDir,
    vec3 normal,
    vec3 lightDir,
    vec3 lightColor,
    float idensity
    ) {

    vec3 halfVec = normalize(lightDir + viewDir);

    float LdotN = dot(lightDir, normal);
    float VdotN = dot(viewDir, normal);
    float HdotN = dot(halfVec, normal);
    float LdotH = dot(lightDir, halfVec);
    float VdotH = dot(viewDir, halfVec);

    if (VdotN < 0. || LdotN < 0.) {
        return vec3(0.);
    }

    float OneMinusLdotH = 1. - LdotH;
    float OneMinusLdotHSqr = OneMinusLdotH * OneMinusLdotH;

    vec3 albedo = material.albedo * lightColor;

    vec3 fresnel = albedo + (1. - albedo) * OneMinusLdotHSqr * OneMinusLdotHSqr * OneMinusLdotH;

    float d = GGX_D(HdotN, material.roughness);
    float g = Smith_G1(VdotN, material.roughness) * Smith_G1(LdotN, material.roughness);
    vec3 specbrdf = fresnel * (g * d / (4. * VdotN * LdotN));

    float OneMinusLdotN = 1. - LdotN;
    float OneMinusLdotNSqr = OneMinusLdotN * OneMinusLdotN;

    float OneMinusVdotN = 1. - VdotN;
    float OneMinusVdotNSqr = OneMinusVdotN * OneMinusVdotN;

    float fd90 = 0.5 + 2.0 * material.roughness * (LdotH * LdotH);
    vec3 diffbrdf = albedo * (1.0 + (fd90 - 1.0) * OneMinusLdotN * OneMinusLdotNSqr * OneMinusLdotNSqr) *
                (1.0 + (fd90 - 1.0) * OneMinusVdotN * OneMinusVdotNSqr * OneMinusVdotNSqr);


    vec3 color = (material.metallic * 0.96 + 0.04) * specbrdf + ((1. - material.metallic) * 0.96) * diffbrdf;
    return color * LdotN * idensity;
}

vec3 calculateImageBasedLight(
    Material material,
    vec3 lightDir,
    vec3 normal,
    vec3 viewDir,
    vec3 specularColor,
    vec3 diffuseColor
) {
    // specularColor = mix(material.albedo, specularColor, material.metallic * 0.5 + 0.5);
    vec3 color = mix(specularColor, diffuseColor, material.roughness);
    return color * material.albedo;
}
`;
}
export type ShaderLib = 
    typeof ShaderSource.calculators__blur__gaussian_glsl |
    typeof ShaderSource.calculators__blur__gaussian_log_glsl |
    typeof ShaderSource.calculators__linearlize_depth_glsl |
    typeof ShaderSource.calculators__packFloat1x32_glsl |
    typeof ShaderSource.calculators__phong_glsl |
    typeof ShaderSource.calculators__shadow_factor_glsl |
    typeof ShaderSource.calculators__types_glsl |
    typeof ShaderSource.calculators__unpackFloat1x32_glsl |
    typeof ShaderSource.debug__checkBox_glsl |
    typeof ShaderSource.definitions__light_glsl |
    typeof ShaderSource.definitions__material_blinnphong_glsl |
    typeof ShaderSource.definitions__material_pbs_glsl |
    typeof ShaderSource.light_model__blinn_phong_glsl |
    typeof ShaderSource.light_model__pbs_ggx_glsl;
export type ShadingVert = 
    typeof ShaderSource.interploters__deferred__geometry_vert |
    typeof ShaderSource.interploters__deferred__tiledLight_vert |
    typeof ShaderSource.interploters__forward__esm__depth_vert |
    typeof ShaderSource.interploters__forward__esm__prefiltering_vert |
    typeof ShaderSource.interploters__forward__gouraud_vert |
    typeof ShaderSource.interploters__forward__phong_vert |
    typeof ShaderSource.interploters__forward__skybox_vert;
export type ShadingFrag = 
    typeof ShaderSource.interploters__deferred__geometry_frag |
    typeof ShaderSource.interploters__deferred__tiledLightPoint_frag |
    typeof ShaderSource.interploters__forward__esm__depth_frag |
    typeof ShaderSource.interploters__forward__esm__prefiltering_frag |
    typeof ShaderSource.interploters__forward__gouraud_frag |
    typeof ShaderSource.interploters__forward__phong_frag |
    typeof ShaderSource.interploters__forward__skybox_frag;
