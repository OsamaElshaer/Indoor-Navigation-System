# Log-Distance Model


The log-distance path loss model, is a model used in wireless communication systems to estimate the signal strength fading over distance.

This model says that when a signal travels a certain distance, its power gets weaker. It's like starting with a certain amount of energy, and as you go further away, you lose some of that energy. The rate at which you lose this energy follows a logarithmic pattern, meaning it decreases gradually, not linearly. The exponent, represented by 'n', controls how fast the signal weakens with distance. Additionally, variance helps account for random fluctuations or obstacles in the environment that can further weaken the signal, like shadows from buildings or walls.






![image](https://th.bing.com/th/id/OIP.Wrxi54B8iAiWg3NDK8rZ2gHaCC?w=340&h=96&c=7&r=0&o=5&dpr=1.3&pid=1.7)




### Equation

The log-distance model is defined by the equation:
![Image](https://awesomescreenshot.s3.amazonaws.com/image/5195608/46639741-532b0adb751d73992a4c30a5ff71aa58.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJSCJQ2NM3XLFPVKA%2F20240309%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240309T143127Z&X-Amz-Expires=28800&X-Amz-SignedHeaders=host&X-Amz-Signature=42523a01574a8ffd0cff6364824db07622c373e176c95a8e1bde368ea3c4dd8e)

Received Power=Transmitted Power−PL

![Image](https://awesomescreenshot.s3.amazonaws.com/image/5195608/46639793-51a0b323134556bb4b33dedb164fa933.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJSCJQ2NM3XLFPVKA%2F20240309%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240309T143600Z&X-Amz-Expires=28800&X-Amz-SignedHeaders=host&X-Amz-Signature=314c441dec97615771def3a23c3cac21f4e928165a69d60df81451988efcc5d6)


where:

- **PL** is the path loss in decibels (dB).
 - **PL0** is the path loss at a reference distance (often taken as 1 meter) in decibels (dB).
- **d** is the distance between the transmitter and receiver.
- **d_0** is the reference distance (usually 1 meter).
- **n** is the path loss exponent, representing how quickly the signal strength attenuates with distance.
- **X** is the variance, representing the variability in RSSI measurements due to environmental factors such as obstacles, reflections, and interference.


<br>
<br>
<br>
due the indoor environments has many variables and obstacles is the relation between the power and d will be random

![Image](https://miro.medium.com/v2/resize:fit:640/format:webp/1*AJaeF3YaujNdtCvMS325nQ.png)

