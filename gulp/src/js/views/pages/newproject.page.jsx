import React from 'react';
import Dropzone from '../../components/dropzone.component.jsx';
import _ from 'lodash';
import AppStore from '../../stores/app.store.jsx';
import AppActions from '../../actions/app.action.jsx';
import Input from '../../components/input.component.jsx';
import ClassNames from 'classnames';

var requiredInput;
var formValidateButton;
var router;

class NewProject extends React.Component {
	constructor(props) {
		super(props);
		this.state = { isPanelOpen: false };
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleOpenPanel = this.handleOpenPanel.bind(this);
		this.getFormData = this.getFormData.bind(this);
	}

	componentWillMount() {
		router = this.context.router;
	}

	componentDidMount() {
		document.title = "Qeewi | Nouveau projet";
		requiredInput = this.refs.newprojectform.getDOMNode().querySelectorAll('[required]');
		this.refs.inputPath.getDOMNode().setAttribute('nwdirectory', true);
		this.refs.inputPath.getDOMNode().setAttribute('directory', true);

	}

	handleChange() {
		var isValidatable = false;
		var flag = false;
		_.map(requiredInput, function(input){
			if (_.isEmpty(_.trim(input.value))) {
				flag = true;
				return false;
			}
		});
		if (!flag){ isValidatable = true };
		AppActions.isValidable(isValidatable);

	}

	getFormData() {
		var form = document.querySelector("#newprojectform");
		var data = form.querySelectorAll("input, textarea, button");
		return data;
	}

	getInputValue(list, identifier) {
		var value = _.result(_.find(list, function(item) {
		  return item.name == identifier;
		}), 'value');
		if(value == undefined) {
			return false
		}
		return value;
	}

	handleSubmit() {
		var formData = this.getFormData();
		formData = _.filter(formData, function(input){
			return  input.value != '';
		})
		formData = _.filter(formData, function(input){
			if (input.type == 'radio'){
				return input.checked;
			} else {
				return input;
			}
		});

		var data = {
			path: this.getInputValue(formData, 'input-path') || '',
			title: this.getInputValue(formData, 'input-title') || '',
			type: this.getInputValue(formData, 'input-preconfig') || 'Site Web',
			desc: this.getInputValue(formData, 'input-desc') || '',
			author: this.getInputValue(formData, 'input-author') || ''
		}

		AppActions.addProject(data);
		var { router } = this.context;
		router.transitionTo('Homepage');
	}

	handleOpenPanel() {
		if(this.state.isPanelOpen){
			this.setState({isPanelOpen: false});
		} else {
			this.setState({isPanelOpen: true});
		}
	}

	render() {
		var classPanel = ClassNames('form-section', 'form-panel', {'form-panel--open': this.state.isPanelOpen})

		if (router.getCurrentQuery().path !== undefined) {
			var pathValue = router.getCurrentQuery().path;
		} else {
			var pathValue = '';
		}
		return (
			<div className="page" ref="newprojectpage">
				<h1 className="page__title">New Project</h1>
				<form ref="newprojectform" id="newprojectform" onChange={this.handleChange}>
					<fieldset className="form-section" id="infogen">
						<legend className="form-section__title">Informations Générales</legend>
						<div className="row">
							<Input
								className="form-section__input input input--8col input--shit2col"
								type="text"
								name="input-title"
								id="input-title"
								required={true}>
								Nom du projet
							</Input>
						</div>
						<div className="row">
							<Input
								className="form-section__input input input--8col input--shit2col input--2row"
								type="textarea"
								name="input-desc"
								id="input-desc"
								required={false}
								maxlength="400">
								Description du project
							</Input>
						</div>
						<div className="row">
							<Input
								className="form-section__input input input--4col input--shit2col"
								type="text"
								name="input-keyword"
								id="input-keyword"
								required={false}>
								Mot-Clés
								</Input>
							<Input
								className="form-section__input input input--4col"
								type="text"
								name="input-author"
								id="input-author"
								required={false}>
								Auteur
							</Input>
						</div>
						<div className="row">
							<Input
								className="form-section__input input input--4col input--shit6col input--dropzone"
								type="file"
								name="input-favicon"
								id="input-favicon"
								accept="image/*"
								required={false}>
								<Dropzone className="input__label__content dropzone">Favicon</Dropzone>
							</Input>
						</div>
					</fieldset>
					<div className={classPanel}>
						<button className="form-panel__button" onClick={this.handleOpenPanel}>Plus d'option</button>
						<fieldset>
							<legend className="form-section__title">Pré-configuration</legend>
							<div className="row">
								<Input
									className="form-section__input input input--4col input--radio"
									type="radio"
									name="input-preconfig"
									value="Site Web"
									id="input-preconfig-siteweb"
									checked={true}>
									Site Web
								</Input>
								<Input
									className="form-section__input input input--4col input--radio"
									type="radio"
									name="input-preconfig"
									value="Web Application"
									id="input-preconfig-webapp">
									Web Application
								</Input>
								<Input
									className="form-section__input input input--4col input--radio"
									type="radio"
									name="input-preconfig"
									value="Prototype"
									id="input-preconfig-prototype">
									Prototype
								</Input>
							</div>
						</fieldset>
					</div>
					<input type="file" ref="inputPath" id="input-path" name="input-path" className="form-section__input input input--hidden" onChange={this.handleSubmit}/>
				</form>
			</div>
		);
	}
}

NewProject.displayName = 'New project page';
NewProject.contextTypes = { router: React.PropTypes.func.isRequired };


export default NewProject;
