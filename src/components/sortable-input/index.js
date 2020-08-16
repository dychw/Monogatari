import { Component } from './../../lib/Component';

class SortableInput extends Component {

	constructor () {
		super();

		this.state = {
			active: true,
		};

		this.props = {
			text: '',
			roles: [],
			warning: '',
			onSubmit: () => { },
			validate: () => { },
			callback: () => { },
		};
	}

	shouldProceed () {
		return Promise.reject('Sortable Input is awaiting user input.');
	}

	willRollback () {
		this.remove();
		return Promise.resolve();
	}

	onStateUpdate (property, oldValue, newValue) {
		if (property === 'active') {
			if (newValue === true) {
				this.classList.toggle('modal--active');
			}
		}
		return Promise.resolve();
	}

	willMount () {
		this.classList.add('modal', 'modal--active');
		return Promise.resolve();
	}

	didMount () {
		this.addEventListener('submit', (event) => {
			event.stopPropagation();
			event.preventDefault();

			const inputValue = {};
			for (let i = 0; i < this.props.roles.length; i++) {
				inputValue[i] = {};
				$('#sortable' + i + ' li').each(function (index) {
					inputValue[i][index] = this.getAttribute('value');
				});
			}

			// Run the validation function asynchronously. If it returns false,
			// it means the input is invalid and we have to show the warning message.
			this.engine.assertAsync(this.props.validate, this.engine, [inputValue]).then(() => {

				// Once validation was done, we run the Save function where usually,
				// the input received will be saved on the storage or used for other
				// actions.
				this.engine.assertAsync(this.props.onSubmit, this.engine, [inputValue]).then(() => {
					// Nothing to do here
				}).catch(() => {
					// Nothing to do here
				}).finally(() => {
					this.remove();
					this.props.callback();
				});
			}).catch(() => {
				// Show the warning message since the input was invalid
				this.content('warning').text(this.props.warning);
			});
		});

		this.content('field').get(0).focus();
		return Promise.resolve();
	}

	readyFunc () {
		$('#sortable0, #sortable1, #sortable2').sortable({
			start: function (event, ui) {
				ui.item.startPos = ui.item.index();
			},
			connectWith: '.connectedSortable'
		});
	}

	render () {
		this.ready(this.readyFunc);
		let render_statement = `
			<form class="modal__content">
			<p>${this.props.roles[0]}</p>
			<ul data-content="field" id="sortable0" class="connectedSortable">
		`;
		for (let i = 0; i < this.props.childGroup.length; i++) {
			render_statement += `
				<li value="${this.props.childGroup[i].id}">
					<img height="30px" src="assets/characters/icon_${this.props.childGroup[i].id}.png">
					img
				</li>
			`;
		}
		render_statement += `
			</ul>
			<hr>
		`;

		for (let i = 1; i < this.props.roles.length; i++) {
			render_statement += `
				<p>${this.props.roles[i]}</p>
				<ul data-content="field" id="sortable${i}" class="connectedSortable">
				</ul>
				<hr>
			`;
		}
		
		render_statement += `
				<div>
					<small data-content="warning" class="block"></small>
					<button type='submit'>OK</button>
				</div>
			<form>
		`;
		return render_statement;
	}
}


SortableInput.tag = 'sortable-input';


export default SortableInput;