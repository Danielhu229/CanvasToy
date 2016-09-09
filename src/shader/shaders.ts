module CanvasToy {
export var basic_frag = "#version 100\n\n#ifdef USE_COLOR\nvarying vec4 vColor;\n#endif\n\n#ifdef USE_MAIN_TEXTURE\nvarying vec2 vMainTextureST;\nuniform sampler2D mainTexture;\nvec4 textureColor;\n#endif\n\n#ifdef OPEN_LIGHT\nvarying vec3 vNormal;\n#endif\n\nvoid main() {\n#ifdef USE_COLOR\n    gl_FragColor = vColor;\n#endif\n\n#ifdef USE_MAIN_TEXTURE\n    gl_FragColor = texture2D(mainTexture, vec2(vMainTextureST.s, vMainTextureST.t));\n#endif\n\n}\n"
export var basic_vert = "#version 100\n\nattribute vec3 position;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform vec4 cameraPosition;\n\n#ifdef USE_COLOR\nattribute vec4 aColor;\nvarying vec4 vColor;\n#endif\n\n#ifdef USE_MAIN_TEXTURE\nattribute vec2 aMainTextureST;\nvarying vec2 vMainTextureST;\n#endif\n\n#ifdef OPEN_LIGHT\nattribute vec3 aNormal;\nvarying vec3 vNormal;\n#endif\n\nvoid main (){\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n\n#ifdef USE_COLOR\n    vColor = aColor;\n#endif\n\n#ifdef USE_MAIN_TEXTURE\n    vMainTextureST = aMainTextureST;\n#endif\n\n}\n"
export var brdf_perfrag_frag = "#ifdef USE_COLOR // color declaration\nuniform vec4 color;\n#endif // color declaration\n\n#ifdef USE_TEXTURE // texture declaration\nvarying vec2 vTextureCoord;\nuniform sampler2D uTextureSampler;\nvec4 textureColor;\n#endif // texture declaration\n\n\n#ifdef OPEN_LIGHT // light declaration\nstruct Light {\n    vec3 specular;\n    vec3 diffuse;\n    float idensity;\n    vec3 position;\n    bool directional;\n};\nuniform vec3 ambient;\nuniform vec3 eyePosition;\nvarying vec3 vPosition;\nvec3 totalLighting;\nuniform Light lights[LIGHT_NUM];\nvarying vec3 vNormal;\n#endif // light declaration\n\nvoid main() {\n#ifdef USE_TEXTURE\n    textureColor = texture2D(uTextureSampler, vec2(vTextureCoord.s, vTextureCoord.t));\n#endif\n#ifdef OPEN_LIGHT\n    totalLighting = ambient;\n    vec3 normal = normalize(vNormal);\n    for (int index = 0; index < LIGHT_NUM; index++) {\n        vec3 lightDir = normalize(lights[index].position - vPosition);\n        float lambortian = max(dot(lightDir, normal), 0.0);\n        vec3 reflectDir = reflect(lightDir, normal);\n        vec3 viewDir = normalize(eyePosition - vPosition);\n        float specularAngle = max(dot(reflectDir, viewDir), 0.0);\n        // TODO: replace the 2rd paramter to material shineness\n        float specular = pow(specularAngle, 16.0);\n        vec3 specularColor = lights[index].specular * specular;\n        vec3 diffuseColor = lights[index].diffuse * lambortian;\n        totalLighting += (diffuseColor + specularColor) * lights[index].idensity;\n    }\n    gl_FragColor = vec4(totalLighting, 1.0);\n#else\n#ifdef USE_COLOR\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n#endif\n#endif\n#ifdef USE_TEXTURE\n    gl_FragColor = gl_FragColor * textureColor;\n#endif\n#ifdef USE_COLOR\n    gl_FragColor = gl_FragColor * color;\n#endif\n}\n"
export var brdf_perfrag_vert = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\n\n#ifdef USE_TEXTURE\nattribute vec2 aTextureCoord;\nvarying vec2 vTextureCoord;\n#endif\n\n#ifdef OPEN_LIGHT\nuniform mat4 normalMatrix;\nattribute vec3 aNormal;\nvarying vec3 vPosition;\nvarying vec3 vNormal;\n#endif\n\nvoid main (){\n    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);\n#ifdef OPEN_LIGHT\n    vNormal = (normalMatrix * vec4(aNormal, 0.0)).xyz;\n    vPosition = gl_Position.xyz;\n#endif\n\n#ifdef USE_TEXTURE\n    vTextureCoord = aTextureCoord;\n#endif\n}\n"
export var brdf_pervert_frag = "#ifdef USE_COLOR // color declaration\nuniform vec4 color;\n#endif // color declaration\n\n#ifdef USE_TEXTURE // texture declaration\nvarying vec2 vTextureCoord;\nuniform sampler2D uTextureSampler;\n#endif // texture declaration\n\n#ifdef OPEN_LIGHT // light declaration\nvarying vec3 vLightColor;\n#endif // light declaration\n\nvoid main() {\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n#ifdef USE_COLOR\n    gl_FragColor = color;\n#endif\n\n#ifdef USE_TEXTURE\n    gl_FragColor = gl_FragColor * texture2D(uTextureSampler, vec2(vTextureCoord.s, vTextureCoord.t));\n#endif\n\n#ifdef OPEN_LIGHT\n    gl_FragColor = gl_FragColor * vec4(vLightColor, 1.0);\n#endif\n}\n"
export var brdf_pervert_vert = "attribute vec3 position;\nuniform mat4 modelViewProjectionMatrix;\n\n#ifdef USE_TEXTURE // texture\nattribute vec2 aTextureCoord;\nvarying vec2 vTextureCoord;\n#endif // texture\n\n#ifdef OPEN_LIGHT // light\nstruct Light {\n    vec3 specular;\n    vec3 diffuse;\n    float idensity;\n    vec3 position;\n    bool directional;\n}; // light\n\nuniform vec3 ambient;\nuniform vec3 eyePosition;\nuniform mat4 normalMatrix;\nattribute vec3 aNormal;\nvarying vec3 vLightColor;\nvec3 totalLighting;\nuniform Light lights[LIGHT_NUM];\n#endif\n\nvoid main (){\n    gl_Position = modelViewProjectionMatrix * vec4(position, 1.0);\n#ifdef OPEN_LIGHT\n    vec3 normal = (normalMatrix * vec4(aNormal, 0.0)).xyz;\n    totalLighting = ambient;\n    normal = normalize(normal);\n    for (int index = 0; index < LIGHT_NUM; index++) {\n        vec3 lightDir = normalize(lights[index].position - gl_Position.xyz);\n        float lambortian = max(dot(lightDir, normal), 0.0);\n        vec3 reflectDir = reflect(lightDir, normal);\n        vec3 viewDir = normalize(eyePosition - gl_Position.xyz);\n        float specularAngle = max(dot(reflectDir, viewDir), 0.0);\n        float specular = pow(specularAngle, 16.0);\n        vec3 specularColor = lights[index].specular * specular;\n        vec3 diffuseColor = lights[index].diffuse * lambortian * lights[index].idensity;\n        totalLighting = totalLighting + (diffuseColor + specularColor);\n    }\n    vLightColor = totalLighting;\n#endif\n#ifdef USE_TEXTURE\n    vTextureCoord = aTextureCoord;\n#endif\n}\n"
export var env_map_vert = ""
}