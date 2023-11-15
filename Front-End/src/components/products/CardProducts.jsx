
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ENDPOINTS } from '../../constants/endpoints';
import useFetchApi from '../../hooks/useFetchApi';
import FavoriteIcon from '../favs/FavoriteIcon';


const CardProducts = ({ name, tel, city, id }) => {

    const {data} = useFetchApi(`${ENDPOINTS.IMAGES}/${id}`);

    const navigate = useNavigate();

    const handleClick = () => navigate(`${ENDPOINTS.CLUB}/${id}`);


    return (
        
        <Card>

            <CardActionArea
                onClick={handleClick}
                sx={{
                    width: 170,
                    height: 280,
                    border: 'none',
                    backgroundColor: '#EDEBEE',
                    display: 'flex',
                    justifyContent:'space-between',
                    flexDirection: 'column'
                }}

            >
                <Typography variant="p" component="p" 
                    sx={{
                        height:'30px', 
                        padding:'10px',
                        margin:'auto',
                        fontSize:'16px',
                        fontWeight:'bold',
                        color: '#1F2E7B',
                    }}>
                        {name}
                </Typography>
                <CardMedia
                    component="img"
                    height={100}
                    image={data? data[0]?.url : ''}
                    sx={{ margin: '20px' }}
                />

                <CardContent sx={{
                    border: 'none',
                    color: '#1F2E7B',
                    padding: '10px',
                }}>
                    
                    <Typography variant="p" component="p">
                        {city}
                    </Typography>
                    <Typography variant="p" component="p">
                        {tel}
                    </Typography>


                    <FavoriteIcon/>


                </CardContent>
            </CardActionArea>

        </Card>
    )
}

export default CardProducts;