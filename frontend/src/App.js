import './App.css';
import { BrowserRouter, Route, Navigate, Routes } from 'react-router-dom'
import { Component } from "react";
import AuthPage from "./pages/Auth";
import EventsPage from "./pages/Events";
import BookingPage from "./pages/Bookings";

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate from="/" to="/auth" exact />} />
                    <Route path="/auth" element={<AuthPage/>} />
                    <Route path="/events" element={<EventsPage/>} />
                    <Route path="/bookings" element={<BookingPage/>} />
                </Routes>
            </BrowserRouter>
        );
    }
}

export default App;
