import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import BreadSizeDisplay from './BreadSizeDisplay.js';

class OrderAdmin extends React.Component {
	render() {
		return (
			<Box m={2}>
				<Typography variant="h5" component="h5" gutterBottom>
					Bread Orders
				</Typography>
				<form>
					<BreadOrderList orders={this.props.orderList} onDropOrder={this.props.onDropOrder} />
					<AddNewBreadOrder breadTypeList={this.props.breadTypeList} onNewOrder={this.props.onAddNewOrder} />
				</form>
			</Box>
		);
	}
}

class BreadOrderList extends React.Component {
	render() {
		return (
			<Grid container spacing={1} m={2}>
				{this.props.orders.map((order) =>
					<BreadOrderListItem key={order.id} order={order} onDropOrder={this.props.onDropOrder} />
				)}
			</Grid>
		);
	}
}

class BreadOrderListItem extends React.Component {
	constructor(props) {
		super(props);

		this.handleDropClick = this.handleDropClick.bind(this);
	}

	handleDropClick() {
		this.props.onDropOrder(this.props.order.id);
	}

	render() {
		return (
			<Grid item xs={12}>
				{this.props.order.customerName}
				{" wants a "}
				{this.props.order.lineItems.map((lineItem, currentIdx) => (
					<span key={lineItem.id}>
						{currentIdx > 0 ? ' and ' : ''}
						{lineItem.breadType} <BreadSizeDisplay isRound={lineItem.isRound} />
					</span>
				))}
				{" loaf."}
				<Button variant="contained" size="small" onClick={this.handleDropClick}>- DROP</Button>
			</Grid>
		);
	}
}

class AddNewBreadOrder extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			currentId: 0,
			customerName: '',
			orderLineItems: []
		};

		this.handleChangeName = this.handleChangeName.bind(this);
		this.addLineItem = this.addLineItem.bind(this);
		this.dropLineItem = this.dropLineItem.bind(this);
		this.handleClickAdd = this.handleClickAdd.bind(this);
	}

	handleChangeName() {
		this.setState({customerName: event.target.value});
	}

	addLineItem(newLineItem) {
		this.setState(state => ({
			orderLineItems: [...this.state.orderLineItems, newLineItem]
		}));
	}

	dropLineItem(id) {
		let filteredLineItems = this.state.orderLineItems.filter(
			lineItem => lineItem.id !== id
		);
		this.setState({orderLineItems: filteredLineItems});
	}

	handleClickAdd() {
		if (this.state.customerName === '' || this.state.orderLineItems.length === 0) return;

		let newOrder = {
			id: this.state.currentId,
			customerName: this.state.customerName,
			lineItems: this.state.orderLineItems
		};
		this.props.onNewOrder(newOrder);

		this.setState(state => ({
			currentId: state.currentId + 1,
			customerName: '',
			orderLineItems: []
		}));
	}

	//handles the scenario where a bread type gets deleted while it is listed in an open order
	static getDerivedStateFromProps(props, currentState) {
		var validLineItems = currentState.orderLineItems.filter(lineItem =>
			props.breadTypeList.some(breadType => breadType === lineItem.breadType)
		);

		return {
			currentId: currentState.currentId,
			customerName: currentState.customerName,
			orderLineItems: validLineItems
		};
	}

	render() {
		return (
			<Box m={1}>
				<TextField id="customer-name" label="Customer Name" value={this.state.customerName} onChange={this.handleChangeName}/> wants: 
				<BreadLineItemList lineItems={this.state.orderLineItems} breadTypeList={this.props.breadTypeList} onNewLineItem={this.addLineItem} onDropLineItem={this.dropLineItem} />
				<Button variant="contained" onClick={this.handleClickAdd}>PLACE ORDER</Button>
			</Box>
		);
	}
}

class BreadLineItemList extends React.Component {
	render() {
		return (
			<Box m={1}>
				<Grid container spacing={1} m={2}>
					{this.props.lineItems.map((lineItem) =>
						<BreadLineItemDisplay lineItem={lineItem} onDropLineItem={this.props.onDropLineItem} />
					)}
				</Grid>
				<AddBreadLineItem breadTypeList={this.props.breadTypeList} onNewLineItem={this.props.onNewLineItem} />
			</Box>
		);
	}
}

class BreadLineItemDisplay extends React.Component {
	constructor(props) {
		super(props);
		
		this.handleDropClick = this.handleDropClick.bind(this);
	}
	
	handleDropClick() {
		this.props.onDropLineItem(this.props.lineItem.id);
	}

	render() {
		return (
			<Grid item key={this.props.lineItem.id} xs={12}>
				a {this.props.lineItem.breadType} <BreadSizeDisplay isRound={this.props.lineItem.isRound} /> loaf
				<Button variant="contained" size="small" onClick={this.handleDropClick}>- DROP</Button>
			</Grid>
		);
	}
}

class AddBreadLineItem extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			currentId: 0,
			breadType: '',
			isRound: false
		};

		this.handleSelection = this.handleSelection.bind(this);
		this.toggleSize = this.toggleSize.bind(this);
		this.handleClickAdd = this.handleClickAdd.bind(this);
	}

	handleSelection(event) {
		this.setState({breadType: event.target.value});
	}

	toggleSize() {
		this.setState(state => ({
			isRound: !state.isRound
		}));
	}
	
	handleClickAdd() {
		if (this.state.breadType === '') return;

		let newLineItem = {
			id: this.state.currentId,
			breadType: this.state.breadType,
			isRound: this.state.isRound
		};
		this.props.onNewLineItem(newLineItem);

		this.setState(state => ({
			currentId: state.currentId + 1,
			breadType: '',
			isRound: false
		}));
	}

	//handles the scenario where a bread type gets deleted while it is selected in the dropdown
	static getDerivedStateFromProps(props, currentState) {
		if (props.breadTypeList.some(breadType => breadType === currentState.breadType)) {
			return currentState;
		}
		
		return {
			currentId: currentState.currentId,
			breadType: '',
			isRound: currentState.isRound
		};
	}

	render () {
		return (
			<Box m={1}>
				<FormControl variant="outlined" style={{minWidth: 200}}>
					<InputLabel id="bread-type-label">Type of Bread</InputLabel>
					<Select name="bread-type" labelId="bread-type-label" value={this.state.breadType} onChange={this.handleSelection}>
						<MenuItem value=''></MenuItem>
						{this.props.breadTypeList.map((breadName) => (
							<MenuItem key={breadName} value={breadName}>{breadName}</MenuItem>
						))}
					</Select>
				</FormControl>
				<Button variant="outlined" onClick={this.toggleSize}><BreadSizeDisplay isRound={this.state.isRound} /></Button> loaf
				<Button variant="contained" size="small" onClick={this.handleClickAdd}>+ ADD</Button>
			</Box>
		);
	}
}

export default OrderAdmin;
