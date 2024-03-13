import React, {useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';

import "./SignIn.css"
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';

import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {ThemeProvider} from '@mui/material/styles';
import {getCurrentTheme} from '../../themes/Theme';
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {useLoginMutation} from "../../../redux/features/api/authApi";
import {setCredentials} from "../../../redux/features/state/authstate";


const defaultTheme = getCurrentTheme();

function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);

    const [showPassword, setShowPassword] = useState(false);


    const [login, {isLoading}] = useLoginMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    if (isLoading) {
        toast.loading("Logging in...", {
            toastId: "loading",
            autoClose: false
        })
    } else {
        toast.dismiss("loading");
    }

    function validateEmail(email) {
        if (!email) {
            setEmailError("Email is required");
            return false;
        }
        let pattern = "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";
        if (!email.match(pattern)) {
            setEmailError("Invalid email");
            return false;
        }
        return true;
    }

    function validatePassword(password) {
        if (!password) {
            setPasswordError("Password is required");
            return false;
        }
        if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters");
            return false;
        }

        if (!password.match("[a-zA-Z]") || !password.match("[0-9]")) {
            setPasswordError("Password must contain letters and numbers");
            return false;

        }
        return true;
    }

    async function onSignIn() {
        setPasswordError(null);
        setEmailError(null);


        let validEmail = validateEmail(email);
        let validPassword = validatePassword(password);

        let validCredentials = validEmail && validPassword;
        if (!validCredentials) return;

        const {data, error} = await login({email, password});

        if (error) handleError(error);
        if (data) handleSuccess(data);

    }

    function handleError(error) {
        if (error.data) {
            toast.error(error.data, {
                toastId: "login",
                autoClose: false
            });

            const searchString = error.data;

            if (/email/i.test(searchString)) {
                setEmailError(error.data);
            } else if (/password/i.test(searchString)) {
                setPasswordError(error.data);
            }
            return;
        }
        // This is when the server is down or there is a network error
        if (error.error) {
            toast.error(error.error, {
                toastId: "login",
                autoClose: 7000
            })
        }

    }

    function handleSuccess(data) {
        toast.success("Logged in successfully", {
            toastId: "login"
        });
        const jwtToken = data.jwtToken;
        dispatch(setCredentials({jwtToken: jwtToken, username: email}));
        setEmail("");
        setPassword("");
        navigate("/", {replace: true});
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" noValidate sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            error={Boolean(emailError)}
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                                setEmailError(null)
                            }
                            }
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            helperText={emailError}
                            autoFocus
                            className={emailError ? "error" : ""}
                        />
                        <TextField
                            margin="normal"
                            error={Boolean(passwordError)}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                setPasswordError(null)
                            }
                            }
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            helperText={passwordError}
                            id="password"
                            autoComplete="current-password"
                            className={passwordError ? "error" : ""}
                            InputProps={{
                                endAdornment:
                                    <InputAdornment position="end">
                                        {showPassword ? <VisibilityOff onClick={() => setShowPassword(false)}/> :
                                            <Visibility onClick={() => setShowPassword(true)}/>}

                                    </InputAdornment>
                            }}
                        />
                        <Button
                            fullWidth
                            onClick={onSignIn}
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            Sign In
                        </Button>

                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default SignIn;