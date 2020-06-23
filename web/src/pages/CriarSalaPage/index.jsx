import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Paper,
  Grid,
  TextField,
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  Divider,
  Button,
  CircularProgress
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import Header from "../../components/Header";
import api from "../../services/api";
import AlertSnackBar from "../../components/AlertSnackBar";

const useStyles = makeStyles({
  container: {
    width: "100%",
    height: "100vh"

    // display: "flex",
    // alignItems: "center"
  }
});

const CriarSalaPage = () => {
  const classes = useStyles();
  const [bloco, setBloco] = useState(null);
  const [numSala, setNumSala] = useState("");
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [loading, setLoading] = useState(false);
  const [alertBar, setAlertBar] = useState({ success: false, error: false });
  const [errMess, setErrMess] = useState("");

  const handleSubmit = event => {
    event.preventDefault();

    setLoading(true);

    api
      .post("/salas", {
        num_sala: numSala,
        id_edificio: parseInt(bloco),
        x: x,
        y: y
      })
      .then(() => {
        setAlertBar({ success: true });
        setLoading(false);
      })
      .catch(data => {
        setErrMess(data.response.data.error);
        setAlertBar({ error: true });
        setLoading(false);
      });
  };

  return (
    <>
      <Header />
      <Container className={classes.container} component="main" maxWidth="md">
        <Box component={Paper} width="100%" p={3}>
          <form onSubmit={handleSubmit}>
            <Grid container>
              <Grid container item xs={3}>
                <Grid item xs={12}>
                  <RadioGroupComponent
                    blocoState={{ bloco: bloco, setBloco: setBloco }}
                  />
                </Grid>
              </Grid>
              <Grid item xs={1}>
                <Divider orientation="vertical" />
              </Grid>
              <Grid container item xs={8}>
                <Grid item xs={12}>
                  <Box>
                    <TextField
                      label="Num_sala"
                      type="number"
                      required
                      InputProps={{ inputProps: { min: 0 } }}
                      value={numSala}
                      onChange={event => setNumSala(event.target.value)}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="x"
                    type="number"
                    InputProps={{ inputProps: { min: 0 } }}
                    value={x}
                    onChange={event => setX(event.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="y"
                    type="number"
                    InputProps={{ inputProps: { min: 0 } }}
                    value={y}
                    onChange={event => setY(event.target.value)}
                  />
                </Grid>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <CircularProgress /> : "Criar"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Container>

      <AlertSnackBar
        open={alertBar.success}
        setOpen={state => setAlertBar({ success: state })}
        severity="success"
        message="Sala criada com sucesso"
        autoHideDuration={3000}
      />

      <AlertSnackBar
        open={alertBar.error}
        setOpen={state => setAlertBar({ error: state })}
        severity="error"
        message={errMess}
        autoHideDuration={3000}
      />
    </>
  );
};

const RadioGroupComponent = ({ blocoState: { bloco, setBloco } }) => {
  const [blocos, setBlocos] = useState([]);

  useEffect(() => {
    api.get("/blocos").then(response => setBlocos(response.data));
  }, []);

  useEffect(() => {
    console.log(bloco);
  }, [bloco]);

  return (
    <FormControl component="fieldset" required>
      <FormLabel component="legend">Bloco</FormLabel>
      <RadioGroup
        aria-label="bloco"
        name="blocos"
        value={bloco}
        onChange={event => setBloco(event.target.value)}
      >
        {blocos.map(bloco => (
          <FormControlLabel
            key={bloco.id}
            value={bloco.id.toString()}
            control={<Radio color="primary" required />}
            label={bloco.designacao}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default CriarSalaPage;
