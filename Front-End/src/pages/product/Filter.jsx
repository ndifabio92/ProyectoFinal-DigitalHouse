import Container from '@mui/material/Box';
import CardProducts from '../../components/products/CardProducts';
import Box from '@mui/material/Box';
import useFetchDataApi from '../../hooks/useFetchDataApi';
import useFetchApi from '../../hooks/useFetchApi';
import Loading from '../../components/loading/Loading'
import { ENDPOINTS } from '../../constants/endpoints';
import { IconButton } from '@mui/material';
import ArrowCircleLeftTwoToneIcon from "@mui/icons-material/ArrowCircleLeftTwoTone";
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { METHODS } from '../../constants/methods';
import { useEffect, useState } from 'react';
import { FormControlLabel, Checkbox} from "@mui/material";



const Filter = () => {

  const { id } = useParams()

  const navigate = useNavigate()

  const { data, isLoading, error, fetchData } = useFetchDataApi();

  const { data: clubsData, isLoading: isLoadingClubsData, error: clubsErrorData } = useFetchApi(`${ENDPOINTS.CLUB}`);
  
  const [ids, setIds] = useState([{ id: parseInt(id) }]);

  const makeNewCategories = (clubs) => {
    var categories = {};

    clubs.forEach(function(club) {
    let categoryId = club.category.id;
    let categoryTitle = club.category.title;

    if (categories[categoryId]) {
      categories[categoryId].cant++;
    } else {
      categories[categoryId] = {
        id: categoryId,
        title: categoryTitle,
        cant: 1
      };
    }
  });

  let result = Object.values(categories);

  return result;

  }

       
 const newCategories = clubsData && makeNewCategories(clubsData) 
    
  const clubs = async () => {
    try {
      const result = await fetchData(ENDPOINTS.CLUB_BY_CATEGORY, METHODS.POST, ids);
      return data?.length;
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    clubs();
  }, [ids]);

  const goBack = () => {
    navigate("/");
  };

  const isChecked = (categoryId) => {
    return ids.some(obj => obj.id === categoryId); 
  };

  const handleChange = (categoryId) => {
    setIds(prevIds => {
      if (isChecked (categoryId)) {
        return prevIds.filter(obj => obj.id !== categoryId);
      } else {
        return [...prevIds, { id: categoryId }];
      }
    });
  };

  return (
    <Container maxWidth="xl"
      sx={{
        color: '#1F2E7B',
        backgroundColor: '#FFFFFF',
        textAlign: 'center',
        padding: '40px',
        mt: '120px',
        mb: '40px',
        mx:'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      
        <> 
          <IconButton
          aria-label="Volver"
          color="#FFFFFF"
          size="large"
          onClick={goBack}
          sx={{
            position: 'absolute',
            right: 10,
            }}
          >
              <ArrowCircleLeftTwoToneIcon fontSize="large" color="#FFFFFF" />
          </IconButton>

          <h2>RESULTADOS DE TU BUSQUEDA</h2>

          <Container
            sx={{
              display:'flex',
              flexDirection:'row',
              gap:'30px',
              }}
          >
            <Box
              sx={{
                display:'flex',
                flexDirection:'column',
                alignItems:'flex-start',
                }}
            >
              <h3>REFINA TU BUSQUEDA</h3>
              
              <h5>DEPORTES</h5>

              {
                newCategories?.map((category) => (
                  
                  <FormControlLabel
                    key={category.id}
                    control={
                      <Checkbox
                        checked={isChecked(category.id)}
                        onChange={()=>handleChange(category.id)}
                      /> 
                    }
                    label={`${category.title} (${category.cant})`}
                  />
                      
                ))
              }

            </Box>

            <Box sx={{
              mx: 'auto',
              my:'100px',
              backgroundColor: '#FFFFFF',
              color: '#1F2E7B',
              display: 'flex',
              textAlign: 'center',
              gap: '40px',
              flexWrap: 'wrap'
            }}>
              
              {
                (isLoading) ? <Loading /> :
              
                clubs && data?.map((club) => (
                  <CardProducts key={club.id} name={club.name} tel={club.phone_number} city={club.address.street + " N° " + club.address.number + ", " + club.address.city.name } id={club.id} />
                ))
              }
            </Box>

          </Container>
        </>
      

    </Container>

  );


}

export default Filter