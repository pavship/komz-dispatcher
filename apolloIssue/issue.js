// https://github.com/apollographql/react-apollo/issues/1958

export default graphql(
  chartItems,
  {
    name: 'chartItems',
    props: ({ chartItems, ownProps }) => {
      // the following log shows updated ownProps (GOOD)
      console.log(ownProps)
      return {
        chartItems: chartItems,
        subscribeToItems: () => chartItems.subscribeToMore({
          document: newItem,
          updateQuery: (prev, { subscriptionData: { data : { newItem } } }) => {
            // the following log shows old initial ownProps (BAD)
            console.log(ownProps)
            // only push newItem if condition is true (CANNOT DO IT AS ownProps ARE WRONG)
            if (ownProps.showFromDate < newItem.date) {
              const filteredItems = prev.chartItems.filter(item => item.id !== newItem.id)
              return { chartItems: [...filteredItems, newItem] }
            } else {
              return { chartItems: prev.chartItems }
            }
          }
        })
      }
    }
  }
)(Chart)
