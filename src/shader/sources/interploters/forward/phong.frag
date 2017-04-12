uniform vec3 ambient;
uniform vec3 materialSpec;
uniform float materialSpecExp;
uniform vec3 materialDiff;
varying vec2 vMainUV;
varying vec4 screenPos;

#ifdef OPEN_LIGHT
varying vec3 vNormal;
varying vec3 vPosition;
#endif

#ifdef _MAIN_TEXTURE
uniform sampler2D uMainTexture;
#endif

#ifdef _ENVIRONMENT_MAP
uniform float reflectivity;
uniform samplerCube uCubeTexture;
#endif

#if (DIR_LIGHT_NUM > 0)
uniform DirectLight directLights[DIR_LIGHT_NUM];
#endif

#if (POINT_LIGHT_NUM > 0)
uniform PointLight pointLights[POINT_LIGHT_NUM];
#endif

#if (SPOT_LIGHT_NUM)
uniform SpotLight spotLights[SPOT_LIGHT_NUM];
#endif

#ifdef USE_SHADOW

    #if (DIR_LIGHT_NUM > 0)
    uniform sampler2D directionShadowMaps[DIR_LIGHT_NUM];
    varying vec4 directShadowCoord[DIR_LIGHT_NUM];
    #endif

    #if (POINT_LIGHT_NUM > 0)
    uniform sampler2D pointShadowMaps[POINT_LIGHT_NUM];
    varying vec4 pointShadowCoord[POINT_LIGHT_NUM];
    #endif

    #if (SPOT_LIGHT_NUM > 0)
    uniform sampler2D spotShadowMaps[SPOT_LIGHT_NUM];
    varying vec4 spotShadowCoord[SPOT_LIGHT_NUM];
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
#ifdef OPEN_LIGHT
    vec3 totalLighting = ambient;
    #if (DIR_LIGHT_NUM > 0)
    for (int index = 0; index < DIR_LIGHT_NUM; index++) {
        vec3 lighting = calculateDirLight(
            directLights[index],
            materialDiff,
            materialSpec,
            materialSpecExp,
            vPosition,
            normal,
            vec3(0.0)
        );
        #ifdef USE_SHADOW
        lighting = lighting * getSpotDirectionShadow(directShadowCoord[index], directionShadowMaps[index]);
        #endif
        totalLighting += lighting;
    }
    #endif
    #if (POINT_LIGHT_NUM > 0)
    for (int index = 0; index < POINT_LIGHT_NUM; index++) {
        vec3 lighting = calculatePointLight(
            pointLights[index],
            materialDiff,
            materialSpec,
            materialSpecExp,
            vPosition,
            normal,
            vec3(0.0)
        );
        totalLighting += lighting;
    }
    #endif
    #if (SPOT_LIGHT_NUM > 0)
    for (int index = 0; index < SPOT_LIGHT_NUM; index++) {
        vec3 lighting = calculateSpotLight(
            spotLights[index],
            materialDiff,
            materialSpec,
            materialSpecExp,
            vPosition,
            normal,
            vec3(0.0)
        );
        #ifdef USE_SHADOW
        lighting = lighting * getSpotDirectionShadow(spotShadowCoord[index], spotShadowMaps[index]);
        #endif
        totalLighting += lighting;

    }
    #endif
    color = totalLighting;
#endif
#ifdef _ENVIRONMENT_MAP
    vec3 viewDir = normalize(-vPosition);
    vec3 skyUV = reflect(-viewDir, vNormal);
    color = mix(color, textureCube(uCubeTexture, skyUV).xyz, reflectivity);
#endif
    gl_FragColor *= vec4(color, 1.0);
    // #ifdef USE_SHADOW
    // #if (DIR_LIGHT_NUM > 0)
    // vec3 NDCoord = directShadowCoord[0].xyz / directShadowCoord[0].w;
    // vec2 uv = NDCoord.xy * 0.5 + 0.5;
    // uv = gl_FragCoord.xy / 1000.0;
    // float shadow = texture2D(directionShadowMaps[0], uv).r;
    // //shadow = 1.0 - (1.0 - shadow) * 5000.0;
    // gl_FragColor = vec4(vec3(shadow), 1.0);
    // #endif
    // #endif
}