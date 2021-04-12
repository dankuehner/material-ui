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

class OrderAdmin extends React.Component {
	constructor(props) {
		super(props);
		this.state = {orders: []};
		
		this.addNewOrder = this.addNewOrder.bind(this);
		this.dropOrder = this.dropOrder.bind(this);
	}

	addNewOrder(newOrder) {
		let newOrderList = [...this.state.orders, newOrder];
		this.setState({ orders: newOrderList });
		this.props.onOrderListChange(newOrderList);
	}

	dropOrder(droppedOrderId) {
		let filteredOrderList = this.state.orders.filter(
			order => order.id !== droppedOrderId
		);
		this.setState({ orders: filteredOrderList });
		this.props.onOrderListChange(filteredOrderList);
	}

	render() {
		return (
			<Box m={2}>
				<Typography variant="h5" component="h5" gutterBottom>
					Bread Orders
				</Typography>
				<form>
					<BreadOrderList orders={this.state.orders} onDropOrder={this.dropOrder} />
					<AddNewBreadOrder breadTypeList={this.props.breadTypeList} onNewOrder={this.addNewOrder} />
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

	getSizeDisplay(order) {
		return order.isRound ? "round" : "pan";
	}
	
	render() {
		return (
			<Grid item xs={12}>
				{this.props.order.customerName} wants a {this.props.order.breadType} {this.getSizeDisplay(this.props.order)} loaf. 
				<Button variant="contained" onClick={this.handleDropClick}>- DROP</Button>
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
			breadType: '',
			isRound: false
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSelection = this.handleSelection.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	handleChange() {
		switch (event.target.id) {
			case 'customer-name':
				this.setState({customerName: event.target.value});
				break;
			case 'is-round':
				this.setState({isRound: event.target.checked});
				break;
		}
	}

	handleSelection(event) {
		switch (event.target.name) {
			case 'bread-type':
				this.setState({breadType: event.target.value});
				break;
		}
	}

	handleClick() {
		if (this.state.customerName === '' || this.state.breadType === '') return;

		let newOrder = {
			id: this.state.currentId,
			customerName: this.state.customerName,
			breadType: this.state.breadType,
			isRound: this.state.isRound
		};
		this.props.onNewOrder(newOrder);

		this.setState(state => ({
			currentId: state.currentId + 1,
			customerName: '',
			breadType: '',
			isRound: false
		}));
	}

	render() {
		return (
			<Box m={1}>
				<TextField id="customer-name" label="Customer Name" value={this.state.customerName} onChange={this.handleChange}/>
				<FormControl variant="outlined" style={{minWidth: 200}}>
					<InputLabel id="bread-type-label">Type of Bread</InputLabel>
					<Select name="bread-type" labelId="bread-type-label" value={this.state.breadType} onChange={this.handleSelection}>
						<MenuItem value=''></MenuItem>
						{this.props.breadTypeList.map((breadName) => (
							<MenuItem key={breadName} value={breadName}>{breadName}</MenuItem>
						))}
					</Select>
				</FormControl>
				<Checkbox id="is-round" label="Is Round" checked={this.state.isRound} onChange={this.handleChange}/> Is Round?
				<Button variant="contained" onClick={this.handleClick}>+ ADD</Button>
			</Box>
		);
	}
}

export default OrderAdmin;
