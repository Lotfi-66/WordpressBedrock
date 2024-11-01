import * as THREE from 'three';

export function animate(logos, renderers, scenes, cameras, underlogos) {
    if (!logos || !Array.isArray(logos)) {
        console.error("Les logos doivent être un tableau");
        return;
    }

    const raycaster = new THREE.Raycaster();
    let isAnimating = false;

    const logoData = logos.map((logo, index) => {
        const underlogo = underlogos[index];

        const uniforms = logo.material.uniforms;
        if (!uniforms.unrollProgress) uniforms.unrollProgress = { value: 1 };
        if (!uniforms.time) uniforms.time = { value: 0 };
        if (!uniforms.rotationX) uniforms.rotationX = { value: 0 };
        if (!uniforms.rotationY) uniforms.rotationY = { value: 0 };
        if (!uniforms.mousePosition) uniforms.mousePosition = { value: new THREE.Vector2(0, 0) };

        scenes[index].add(underlogo);

        return {
            logo,
            underlogo,
            uniforms,
            unrollProgress: 1,
            isMouseOver: false,
            mouseX: 0,
            mouseY: 0,
            targetRotationX: 0,
            targetRotationY: 0,
        };
    });

    function animateFrame() {
        requestAnimationFrame(animateFrame);

        if (isAnimating) {
            let allUnrolled = true;
            logoData.forEach(data => {
                data.unrollProgress -= 0.01;
                if (data.unrollProgress > 0) {
                    allUnrolled = false;
                } else {
                    data.unrollProgress = 0;
                    data.underlogo.visible = false;
                }
                data.uniforms.unrollProgress.value = data.unrollProgress;
            });
            if (allUnrolled) {
                isAnimating = false;
            }
        } else {
            logoData.forEach(data => {
                if (data.isMouseOver) {
                    data.logo.rotation.x += (data.targetRotationX - data.logo.rotation.x) * 0.1;
                    data.logo.rotation.y += (data.targetRotationY - data.logo.rotation.y) * 0.1;
                } else {
                    data.logo.rotation.x += (0 - data.logo.rotation.x) * 0.05;
                    data.logo.rotation.y += (0 - data.logo.rotation.y) * 0.05;
                }
                data.uniforms.time.value += 0.016;
                data.uniforms.rotationX.value = data.logo.rotation.x;
                data.uniforms.rotationY.value = data.logo.rotation.y;
            });
        }

        logoData.forEach((data, index) => {
            renderers[index].render(scenes[index], cameras[index]);
        });
    }

    function onMouseMove(event) {
        event.preventDefault();

        logoData.forEach((data, index) => {
            const rect = renderers[index].domElement.getBoundingClientRect();
            const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), cameras[index]);
            const intersects = raycaster.intersectObject(data.logo);

            if (intersects.length > 0) {
                data.isMouseOver = true;
                data.targetRotationY = mouseX * 1.5;
                data.targetRotationX = mouseY * 1.5;
            } else {
                data.isMouseOver = false;
            }
        });
    }

    function onWindowResize() {
        cameras.forEach(camera => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        });
        renderers.forEach(renderer => {
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onWindowResize);

    animateFrame();

    function startAnimation() {
        isAnimating = true;
    }

    return {
        cleanup: function() {
            document.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', onWindowResize);
        },
        start: startAnimation
    };
}