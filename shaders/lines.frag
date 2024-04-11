#include <flutter/runtime_effect.glsl>

uniform float iTime;
uniform vec2 iResolution;

out vec4 fragColor;

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 u_resolution = iResolution.xy;
    float u_time = iTime;

    vec4 u_background = vec4(0, 0, 0, 1); 
    float u_phase = 0.5;
    float u_scale = 0.5;
    float u_glow = 0.524;
    float u_distort_scale = 0.5;
    float u_power = 0.3;
    float u_speed = 0.13;
    int u_iterations = 4;
    float u_brightness = 0.478;

    // Adjust UV for aspect ratio
    vec2 uv = fragCoord.xy / u_resolution.xy;
    float aspectRatio = u_resolution.x / u_resolution.y;
    uv.x *= aspectRatio;

    vec2 XYScale = vec2(1.0, 1.0);
    vec2 XYMove = vec2(0.0, 0.0);

    // Centered pixel coordinates
    uv -= vec2(0.5, 0.5) * vec2(1, 1.0);

    float t = u_time;
    float phase = (u_phase * 10.) * u_speed * sin(t);
    
    // Scaling
    uv *= 10.0 * (1.0 - u_scale);
    uv.xy = uv.xy * XYScale + XYMove;

    vec4 finalCol = vec4(0.);
    float halfDistort = u_distort_scale / 0.5;
    float distortsc2 = u_distort_scale / (u_distort_scale + halfDistort);
        
    for(float i = 1.0; i <= 4.0; i++){
        uv.x += u_power / i * sin(i * u_distort_scale * uv.y - phase);
        uv.y += u_power / i * sin(i * distortsc2 * uv.x + phase);
    }
    
    vec4 col = vec4(vec4(u_glow) / sin((t * 2.0 * u_speed) - length(uv.yx) - uv.y));
    finalCol = vec4(col * col);
    
    vec4 Color = vec4(1.) * 2.0 * u_brightness;
    Color = Color * Color * 0.5 + 0.5 * cos(phase + uv.xyxy + vec4(0,2,4,1.0)) * 0.7;
    Color = finalCol * Color * 1.0;

    // Output to screen
    fragColor = (Color * Color.a) + (u_background * (1. - Color.a));
}

void main(void) { mainImage(fragColor, FlutterFragCoord()); }