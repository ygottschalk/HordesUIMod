import { makeElement } from '../../utils/misc';
import { getTempState } from '../../utils/state';

function cancelClick(event) {
	event.stopPropagation();
}

function init() {
	const skillbar = document.querySelector('#skillbar:not(.js-skillbar-click-initd)');
	if (!skillbar) return;
	skillbar.classList.add('js-skillbar-click-initd');
	const tempState = getTempState();
	Array.from(skillbar.querySelectorAll('.slot:not(.js-skill-click-initd)')).forEach(skill => {
		skill.classList.add('js-skill-click-initd');

		const skillOverlay = makeElement({
			element: 'div',
			class: 'uimod-skill-click-overlay',
		});
		skillOverlay.setAttribute(
			'style',
			`left: ${skill.offsetLeft}px; top: ${skill.offsetTop}px;`,
		);
		skillOverlay.setAttribute('data-for', skill.id);
		skill.parentNode.insertBefore(skillOverlay, skill.nextSibling);

		// Prevent button press, but proxy it through if alt is down
		skillOverlay.addEventListener('pointerdown', () => {
			if (tempState.keyModifiers.alt) {
				skill.dispatchEvent(new Event('pointerdown'));
			}
		});

		skillOverlay.addEventListener('pointerup', () => {
			const inSkillDragState = document.querySelector(
				'.slotskill:not(#skillbar .slotskill, #skilllist .slotskill)',
			);
			if (inSkillDragState || tempState.keyModifiers.alt) {
				skill.dispatchEvent(new Event('pointerup'));
				window.addEventListener('click', cancelClick, {
					capture: true,
					once: true,
				});
				setTimeout(() => window.removeEventListener('click', cancelClick), 0);
			}
		});

		skillOverlay.addEventListener('click', () => {
			const keyHolder = skill.querySelector('.key');
			if (!keyHolder) return;
			const key = keyHolder.textContent;
			if (!key || key.length !== 1) return;
			document.body.dispatchEvent(
				new KeyboardEvent('keydown', {
					bubbles: true,
					cancelable: true,
					char: key,
					key: key,
				}),
			);
			document.body.dispatchEvent(
				new KeyboardEvent('keyup', {
					bubbles: true,
					cancelable: true,
					char: key,
					key: key,
				}),
			);
		});

		// Hovering to see the tooltip works normally, proxy it through
		skillOverlay.addEventListener('pointerover', () => {
			skill.dispatchEvent(new Event('pointerover'));
		});
		skillOverlay.addEventListener('pointerenter', () => {
			skill.dispatchEvent(new Event('pointerenter'));
		});
		skillOverlay.addEventListener('pointerleave', () => {
			skill.dispatchEvent(new Event('pointerleave'));
		});
		skillOverlay.addEventListener('pointerout', () => {
			skill.dispatchEvent(new Event('pointerout'));
		});
	});
}

export default {
	name: 'Skill Click',
	description:
		'Make skills in skillbar activate by clicking on them. Place/Move them by holding ALT kye while dragging them.',
	run: () => {
		init();
	},
};
