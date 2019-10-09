<!-- 
.. title: Circle Formation using Buzz
.. slug: circle-formation-using-buzz
.. date: 2016-08-09 20:52:01 UTC-04:00
.. tags: Buzz,swarming
.. category: Robotics
.. link: 
.. author: Giovanni Beltrame
.. description: A video of a set of Khepera IV using Buzz
.. type: text
-->

When we designed our language [Buzz](http://the.swarming.buzz), we wanted to create something that could be ported to any robot.
We have made an initial port of Buzz for a popular robotic platform, the [Khepera IV](http://www.k-team.com/mobile-robotics-products/khepera-iv).
The result of this port is a "glue" library that provides a set of functions for controlling the robot to the Buzz interpreter. As usual,
we have released the (still unfinished!) code on [GitHub](https://github.com/MISTLab/BuzzKH4). The total integration work was only a couple of days'
work, a testament to the portability of Buzz.

So we can now proudly show an example of Buzz at work: we programmed the Kheperas with a simple algorithm that, without computation,
leads to circle formation. The algorithm itself will be the subject of a future publication. What the video shows is that the robots
can be successfully controlled and their sensors used to perform swarming tasks:

<iframe width="560" height="315" src="https://www.youtube.com/embed/rwNtbAXgJaQ" frameborder="0" allowfullscreen></iframe>

## Credits:

* Programming: [Carlo Pinciroli](/people/cpinciroli/), [David St-Onge](/people/dstonge/)
* Video: [David St-Onge](/people/dstonge/)
* We would also like to thank NSERC for letting us purchase the Kheperas
