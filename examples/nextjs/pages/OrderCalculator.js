import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

function OrderCalculator(props) {
	const ordersToMake = calculateOrdersToMake(props.orderList);
	const unsatisfiedCustomers = getUnsatisfiedCustomers(props.orderList, ordersToMake);

	return (
		<Box m={2}>
			<Typography variant="h5" component="h5" gutterBottom>
				Order Calculator
			</Typography>
			<Grid container spacing={1} m={2}>
			{ordersToMake.map(order => (
				<Grid item xs={12} key={order.id}>
					Make a {order.breadType} {getSizeDisplay(order)} loaf for {order.customerName}.
				</Grid>
			))}
			{unsatisfiedCustomers.map(customerName => (
				<Grid item xs={12} key={customerName}>
					(Contact {customerName} because their order can't be completed.)
				</Grid>
			))}
			</Grid>
		</Box>
	);
}

function getSizeDisplay(order) {
	return order.isRound ? "round" : "pan";
}

function calculateOrdersToMake(orderList) {
	const breadTypes = new Set(orderList.map(order => order.breadType));
	const ordersByBreadType = createArrayOfOrdersByBreadType(orderList, breadTypes);
	const allCombinationsOfOrders = generateAllCombinations(ordersByBreadType);
	const bestCombination = findBestOrderCombination(allCombinationsOfOrders);

	return bestCombination;
}

function createArrayOfOrdersByBreadType(orderList, breadTypes) {
	let ordersArray = [];
	let currentIndex = 0;
	
	breadTypes.forEach((breadType) => {
		ordersArray[currentIndex++] = orderList.filter((order) => order.breadType === breadType);
	});
	return ordersArray;
}

function generateAllCombinations(twoDimensionalArray) {
	let combinations = [];
	generateCombinationLevel(twoDimensionalArray, combinations);
	return combinations;
}

function generateCombinationLevel(twoDimensionalArray, combinations, currentCombination) {
	if (!currentCombination) currentCombination = [];
	
	if (currentCombination.length >= twoDimensionalArray.length) {
		combinations.push(currentCombination);
		return;
	}
	
	const currentLevel = twoDimensionalArray[currentCombination.length];
	currentLevel.forEach(function(item) {
		generateCombinationLevel(twoDimensionalArray, combinations, [...currentCombination, item]);
	});
}

function findBestOrderCombination(orderCombinations) {
	let bestScore = {
		orderCombination: [],
		satisfiedCustomerCount: 0,
		panBakedCount: 0
	};
	
	orderCombinations.forEach((combination) => {
		const calculatedScore = calculateOrderCombinationScore(combination);
		
		console.log(combination);
		console.log(calculatedScore);

		if (isFirstScoreBetterThanSecond(calculatedScore, bestScore)) {
			bestScore = calculatedScore;
		}
	});
	
	return bestScore.orderCombination;
}

function calculateOrderCombinationScore(orders) {
	return {
		orderCombination: orders,
		satisfiedCustomerCount: new Set(orders.map(order => order.customerName)).size,
		panBakedCount: orders.filter(order => !order.isRound).length
	};
}

function isFirstScoreBetterThanSecond(firstScore, secondScore) {
	if (firstScore.satisfiedCustomerCount < secondScore.satisfiedCustomerCount) return false;
	if (firstScore.satisfiedCustomerCount > secondScore.satisfiedCustomerCount) return true;

	//otherwise both have the same number of satisfied customers, so compare the number of pan bakes.
	if (firstScore.panBakedCount > secondScore.panBakedCount) return true;
	return false;
}

function getUnsatisfiedCustomers(allOrders, ordersToMake) {
	const customers = new Set(allOrders.map(order => order.customerName));
	return [...customers].filter(customerName => !isCustomerInOrderList(customerName, ordersToMake));
}

function isCustomerInOrderList(customerName, orders) {
	return orders.filter(order => order.customerName === customerName).length > 0;
}

export default OrderCalculator;
