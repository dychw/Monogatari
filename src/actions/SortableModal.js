import { Action } from './../lib/Action';

export class SortableModal extends Action {

	static matchObject ({ Sortable }) {
		return typeof Sortable !== 'undefined';
	}

	constructor ({ Sortable }) {
		super ();
		this.statement = Sortable;

		if (typeof this.statement.Validation !== 'function') {
			this.statement.Validation = () => true;
		}

		if (typeof this.statement.Ok !== 'function') {
			this.statement.Ok = () => true;
		}

		if (typeof this.statement.Warning !== 'string') {
			this.statement.Warning = '';
		}
	}

	apply () {
		this.engine.global ('block', true);

		const input = document.createElement ('sortable-input');

		const { Text, ChildGroup, Roles, Warning, Ok, Validation } = this.statement;

		input.setProps ({
			text: this.engine.replaceVariables (Text),
			childGroup: ChildGroup,
			roles: Roles,
			warning: Warning,
			onSubmit: Ok,
			validate: Validation,
			callback: () => {
				this.engine.global ('block', false);
				this.engine.proceed ({ userInitiated: true, skip: false, autoPlay: false });
			}
		});

		this.engine.element ().find ('[data-screen="game"]').append (input);
		return Promise.resolve ();
	}
}

SortableModal.id = 'Sortable';

export default SortableModal;