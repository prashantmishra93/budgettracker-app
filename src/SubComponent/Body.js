import React from 'react'
import BarChart from './BarChart';

const Body = () => {
    const data = [30, 80, 45, 60, 20, 90, 50];
    return (
        <div>
            <BarChart data={data} />
        </div>
    )
}

export default React.memo(Body)
