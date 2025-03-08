import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import Typography from '@mui/material/Typography';


import { page2_table_carousel } from '../utils/alllongtext';

const handleDragStart = (e) => e.preventDefault();

const exmple_items = [
    <img src="path-to-img" onDragStart={handleDragStart} role="presentation" />,
    <img src="path-to-img" onDragStart={handleDragStart} role="presentation" />,
    <img src="path-to-img" onDragStart={handleDragStart} role="presentation" />,
];

// items - set number of items in the slide. Default: 1
const responsive = {
    0: { items: 1 },
    568: { items: 2 },
    1024: { items: 3 },
};
export default function Carousel() {
    const carousel_items = CarouselItems()

    // disableButtonsControls={true}
    return (<AliceCarousel disableDotsControls={true} responsive={responsive} mouseTracking items={carousel_items} />)
}
function CarouselItems() {

    const degree_level = [100, 150, 180, 200, 240, 270, 300]
    // const describ_texts = ["空调：几乎不开，可能用风扇代替。\n洗衣机：每周1次，冷水洗涤。\n冰箱：节能小型冰箱，持续运行。\n电视/电脑：使用频率极低，电视每周几次，电脑偶尔用。\n热水器：基本不用，冷水洗澡为主。\n照明：LED灯，每晚使用3小时以内。\n厨房电器：很少使用，仅偶尔用电饭煲、电水壶。\n生活特点：极度节约，低舒适度。"]
    const describ_texts = page2_table_carousel
    const items = degree_level.map((val, index) => {

        let listdegree = describ_texts[index].split('\n').map((val) => (<p className='p-diy-marigin'>{val}</p>))
        return (
            <>
                <Box key={index} height={330} sx={{ p: 0.5 }}>
                    <Paper variant={"outlined"} sx={{ p: 2, m: 0.5, height: '100%', textAlign: 'center' }}>
                        <Typography variant="subtitle2">{index}：{val}度</Typography>
                        <Typography variant="caption" sx={{ textAlign: 'left', }}>{listdegree}</Typography>
                    </Paper>
                </Box>
            </>
        )
    })


    return items

}

