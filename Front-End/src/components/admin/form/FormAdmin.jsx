import { Button, Container, FormControlLabel, MenuItem, Switch, TextField } from "@mui/material";
import { useFormik } from "formik";
import { validationSchemaForm as validationSchema } from "../../../validations/ValidationSchemaAdmin";
import styles from './styles.module.css';
import { useNavigate } from 'react-router-dom';

export default function FormAdmin() {

    const navigate = useNavigate();

    const cities = [
        { id: 1, name: "Córdoba" },
        { id: 2, name: "Mendoza" },
        { id: 3, name: "Buenos Aires" },
    ];

    const initialValues = {
        name: '', phone_number: '', recommended: false,
        address: {
            street: '',
            number: '',
            floor: '',
            apartment: '',
            city: ''
        },
        images: []
    }

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: () => {
            console.log(formik.values)
            submitForm(formik.values); 
          },
    });

    const submitForm = async (values) => {
        try {
          const response = await fetch('http://localhost:8080/club', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          });
      
          if (response.ok) {
            console.log("La Solicitur Post se envio correctamente")
            navigate('/admin');
          } else {
            console.log("error")
          }
        } catch (error) {
            console.log(error)
        }
      };

    return (
        <Container maxWidth="md">
            <form onSubmit={formik.handleSubmit} className={`${styles.form}` }>
              
                {
                    formik.touched.name && formik.errors.name && (
                        <span style={{ color: 'red' }}>{formik.errors.name}</span>
                    )
                }
                <TextField variant="outlined" size="small" label="Nombre" type="text" name="name" className="input-background"
                    value={formik.values.name}
                    onChange={formik.handleChange} onBlur={formik.handleBlur} />
                
                {
                    formik.touched.phone_number && formik.errors.phone_number && (
                        <span style={{ color: 'red' }}>{formik.errors.phone_number}</span>
                    )
                }
                <TextField variant="outlined" size="small" label="Telefono" type="text" name="phone_number" className="input-background"
                    value={formik.values.phone_number}
                    onChange={formik.handleChange} onBlur={formik.handleBlur} />
                
              
                
                {
                    formik.touched.address?.street && formik.errors.address?.street && (
                        <span style={{ color: 'red' }}>{formik.errors.address?.street}</span>
                    )
                }
                <TextField variant="outlined" size="small" label="Calle" type="text" name="address.street" className="input-background" 
                    value={formik.values.address?.street}
                    onChange={formik.handleChange} onBlur={formik.handleBlur} />
                
                {
                    formik.touched.address?.number && formik.errors.address?.number && (
                        <span style={{ color: 'red' }}>{formik.errors.address?.number}</span>
                    )
                }
                <TextField variant="outlined" size="small" label="Numero" type="number" name="address.number" className="input-background" 
                    value={formik.values.address?.number}
                    onChange={formik.handleChange} onBlur={formik.handleBlur} />
                
                {
                    formik.touched.address?.floor && formik.errors.address?.floor && (
                        <span style={{ color: 'red' }}>{formik.errors.address?.floor}</span>
                    )
                }
                <TextField variant="outlined" size="small" label="Piso" type="number" name="address.floor" className="input-background" 
                    value={formik.values.address?.floor}
                    onChange={formik.handleChange} onBlur={formik.handleBlur} />
                
                {
                    formik.touched.address?.apartment && formik.errors.address?.apartment && (
                        <span style={{ color: 'red' }}>{formik.errors.address?.apartment}</span>
                    )
                }
                <TextField variant="outlined" size="small" label="Apartamento" type="text" name="address.apartment" className="input-background" 
                    value={formik.values.address?.apartment}
                    onChange={formik.handleChange} onBlur={formik.handleBlur} />
                
                {
                    formik.touched.address?.city && formik.errors.address?.city && (
                        <span style={{ color: 'red' }}>{formik.errors.address?.city}</span>
                    )
                }
                <TextField variant="outlined" size="small" label="Ciudad" select name="address.city.id" className="input-background" 
                    value={formik.values.address?.city}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}>
                    {cities.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                            {option.name}
                        </MenuItem>
                    ))}
                </TextField>

                {
                    formik.touched.recommended && formik.errors.recommended && (
                        <span style={{ color: 'red' }}>{formik.errors.recommended}</span>
                    )
                }
                
                    <FormControlLabel labelPlacement="start" label="Recomendado" control={<Switch label="Recomandado" name="recommended" className="input-background"
                        checked={formik.values.recommended}
                        onChange={formik.handleChange} onBlur={formik.handleBlur} />}
                    />
                {/* <TextField variant="outlined" size="small" type="file" inputProps={{ multiple: true }} onChange={formik.handleChange} name="files" /> */}

                <Button variant="contained" type="submit">Crear Producto</Button>
            </form>
        </Container>
    )
}
