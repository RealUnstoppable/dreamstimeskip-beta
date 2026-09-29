const fs = require('fs');
let code = fs.readFileSync('css/harmonytunes.css', 'utf8');

if (!code.includes('spinGlowAngle')) {
    code += `
/* Add Lexi spinning glow to harmonytunes small blob */
@keyframes spinGlowAngleHT {
    0% { --glow-angle: 0deg; }
    100% { --glow-angle: 360deg; }
}
.lexi-mixer-wrapper { position: relative; }
.lexi-mixer-wrapper::before {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: calc(100% + 15px);
    height: calc(100% + 15px);
    border-radius: 50px;
    background: conic-gradient(
        from var(--glow-angle, 0deg),
        rgba(255, 0, 127, 0.8), 
        rgba(127, 0, 255, 0.2), 
        rgba(0, 127, 255, 0.8), 
        rgba(0, 255, 127, 0.2), 
        rgba(255, 127, 0, 0.8), 
        rgba(255, 0, 127, 0.8)
    );
    filter: blur(8px);
    z-index: 10; /* Put behind the blob which has z-index 50 */
    opacity: 0.8;
    pointer-events: none;
    animation: spinGlowAngleHT 3s linear infinite;
}
@property --glow-angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}
`;
    fs.writeFileSync('css/harmonytunes.css', code, 'utf8');
}
