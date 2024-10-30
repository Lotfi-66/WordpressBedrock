import * as THREE from 'three';
console.log('Three.js version:', THREE.REVISION);
import { animate } from './animate.js';
import vertexShaderSource from '../shaders/vertexShader.glsl?raw';
import fragmentShaderSource from '../shaders/fragmentShader.glsl?raw';
import underlogoVertexShaderSource from '../shaders/underlogoVertexShader.glsl?raw';
import underlogoFragmentShaderSource from '../shaders/underlogoFragmentShader.glsl?raw';

console.log('Shaders chargés');

const textureLoader = new THREE.TextureLoader();
const logoElements = new Map();

function loadTexture(path) {
    console.log(`Tentative de chargement de la texture: ${path}`);
    return new Promise((resolve, reject) => {
        textureLoader.load(
            path,
            (texture) => {
                console.log(`Texture chargée avec succès: ${path}`);
                resolve(texture);
            },
            (progress) => console.log(`Progression du chargement de ${path}: ${(progress.loaded / progress.total * 100).toFixed(2)}%`),
            (error) => {
                console.error(`Erreur lors du chargement de la texture ${path}:`, error);
                reject(error);
            }
        );
    });
}

async function createLogo(logoPath, logoName, container, stickerId) {
    console.log(`Création du logo: ${logoName}, chemin: ${logoPath}, stickerId: ${stickerId}`);
    let scene, camera, renderer, logo, raycaster, underlogoShape;

    async function init() {
        console.log(`Initialisation pour ${logoName}`);
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 5;
        console.log(`Caméra créée pour ${logoName}`);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);
        console.log(`Renderer créé et ajouté au container pour ${logoName}`);

        raycaster = new THREE.Raycaster();
        console.log(`Raycaster créé pour ${logoName}`);

        try {
            console.log(`Chargement des textures pour ${logoName}`);
            const [logoTexture, holoTexture] = await Promise.all([
                loadTexture(logoPath),
                loadTexture('http://localhost:8000/app/themes/sticker/resources/images/Holo.jpg')
            ]);
            console.log(`Textures chargées pour ${logoName}`);

            const material = new THREE.ShaderMaterial({
                vertexShader: vertexShaderSource,
                fragmentShader: fragmentShaderSource,
                uniforms: {
                    logoTexture: { value: logoTexture },
                    holoTexture: { value: holoTexture },
                    time: { value: 0 },
                    rotationX: { value: 0 },
                    rotationY: { value: 0 },
                    mousePosition: { value: new THREE.Vector2(0, 0) },
                    unrollProgress: { value: 1 },
                    borderColor: { value: new THREE.Color(0xffffff) },
                    borderThickness: { value: 0.01 },
                    underlogoColor: { value: new THREE.Color(0x000000) }
                },
                transparent: true,
                side: THREE.DoubleSide
            });
            console.log(`Matériel créé pour ${logoName}`);

            const geometry = new THREE.PlaneGeometry(2, 2, 32, 32);
            logo = new THREE.Mesh(geometry, material);
            logo.isMouseOver = false;
            logo.targetRotationX = 0;
            logo.targetRotationY = 0;
            scene.add(logo);
            console.log(`Logo créé et ajouté à la scène pour ${logoName}`);

            const underlogoGeometry = new THREE.PlaneGeometry(2.1, 2.1, 32, 32);
            const underlogoMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    color: { value: new THREE.Color(0x000000) },
                    borderColor: { value: new THREE.Color(0xffffff) },
                    borderThickness: { value: 0.05 },
                    depth: { value: 0.3 }
                },
                vertexShader: underlogoVertexShaderSource,
                fragmentShader: underlogoFragmentShaderSource,
                transparent: true
            });
            underlogoShape = new THREE.Mesh(underlogoGeometry, underlogoMaterial);
            underlogoShape.position.z = -0.01;
            scene.add(underlogoShape);
            console.log(`Underlogo créé et ajouté à la scène pour ${logoName}`);

            logo.visible = false;
            underlogoShape.visible = false;

            console.log(`Initialisation terminée pour ${logoName}`);
            return { logo, underlogoShape, renderer, scene, camera };
        } catch (error) {
            console.error(`Erreur lors de l'initialisation pour ${logoName}:`, error);
            return null;
        }
    }

    const elements = await init();

    if (elements) {
        console.log(`Éléments créés avec succès pour ${logoName}`);
        logoElements.set(stickerId, { ...elements, container, animationControl: null });
        console.log(`Éléments ajoutés à logoElements pour stickerId: ${stickerId}`);
    } else {
        console.error(`Échec de la création des éléments pour ${logoName}`);
    }

    return elements;
}

async function initAllLogos() {
    console.log('Initialisation de tous les logos');
    const stickerItems = document.querySelectorAll('.sticker-item');
    console.log(`Nombre de stickers trouvés: ${stickerItems.length}`);
    for (const item of stickerItems) {
        const imgElement = item.querySelector('img');
        const logoNameElement = item.querySelector('.logo-name');

        if (imgElement && logoNameElement) {
            const logoPath = imgElement.src;
            const logoName = logoNameElement.textContent;
            const stickerId = item.dataset.stickerId;
            console.log(`Traitement du logo: ${logoName}, chemin: ${logoPath}, stickerId: ${stickerId}`);
            await createLogo(logoPath, logoName, item, stickerId);
            console.log(`Logo créé: ${logoName}`);
            
            // Cacher l'image originale
            imgElement.style.display = 'none';
            console.log(`Image originale cachée pour ${logoName}`);

            // Vérifier si le sticker est déjà déverrouillé
            const isUnlocked = localStorage.getItem(`sticker_${stickerId}_unlocked`) === 'true';
            console.log(`Statut de déverrouillage pour ${logoName}: ${isUnlocked}`);
            if (isUnlocked) {
                activateSticker(stickerId);
            }
        } else {
            console.error('Élément manquant dans sticker-item:', item);
        }
    }
}

function activateSticker(stickerId) {
    console.log(`Tentative d'activation du sticker: ${stickerId}`);
    const elements = logoElements.get(stickerId);
    if (elements) {
        elements.container.classList.add('unlocked');
        elements.logo.visible = true;
        elements.underlogoShape.visible = true;
        console.log(`Sticker ${stickerId} rendu visible`);
        if (!elements.animationControl) {
            console.log(`Démarrage de l'animation pour le sticker ${stickerId}`);
            elements.animationControl = animate([elements.logo], [elements.renderer], [elements.scene], [elements.camera], [elements.underlogoShape]);
        }
        elements.animationControl.start();
        console.log(`Animation démarrée pour le sticker ${stickerId}`);
    } else {
        console.error(`Éléments non trouvés pour le sticker ${stickerId}`);
    }
}

function setupUnlockForm() {
    const form = document.getElementById('unlock-form');
    const input = document.getElementById('unlock-code');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = input.value.trim();
        if (code) {
            console.log(`Tentative de déverrouillage avec le code: ${code}`);
            jQuery.ajax({
                url: '/wp-admin/admin-ajax.php',
                type: 'POST',
                data: {
                    action: 'check_unlock_code',
                    code: code
                },
                success: function(response) {
                    console.log('Réponse reçue:', response);
                    if (response.success) {
                        console.log(`Déverrouillage réussi pour le sticker ${response.data.sticker_id}`);
                        activateSticker(response.data.sticker_id);
                        localStorage.setItem(`sticker_${response.data.sticker_id}_unlocked`, 'true');
                        alert('Sticker déverrouillé !');
                    } else {
                        console.log('Échec du déverrouillage');
                        alert('Code invalide ou déjà utilisé.');
                    }
                },
                error: function(xhr, status, error) {
                    console.error('Erreur AJAX:', status, error);
                    alert('Une erreur est survenue. Veuillez réessayer.');
                }
            });
        }
        input.value = '';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM chargé, initialisation des logos');
    initAllLogos().then(() => {
        console.log("Tous les logos ont été créés");
        setupUnlockForm();
    }).catch(error => {
        console.error("Erreur lors de l'initialisation des logos:", error);
    });
});

window.addEventListener('resize', () => {
    console.log('Redimensionnement de la fenêtre');
    logoElements.forEach((elements, stickerId) => {
        if (elements.renderer) {
            elements.renderer.setSize(elements.container.clientWidth, elements.container.clientHeight);
            console.log(`Canvas redimensionné pour le sticker ${stickerId}`);
        }
    });
});

console.log('Script chargé');