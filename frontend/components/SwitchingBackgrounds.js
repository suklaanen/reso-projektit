import React, { useEffect, useState } from 'react';
import { StyleSheet, ImageBackground } from 'react-native';

import bg1 from '../assets/images/bg1.png';

const SwitchingBackgrounds = () => {
    const images = [bg1];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 9000); 

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <ImageBackground
            source={images[currentImageIndex]}
            style={styles.background}
            resizeMode="cover" 
        >
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1, 
        justifyContent: 'center', 
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
});

export default SwitchingBackgrounds;
