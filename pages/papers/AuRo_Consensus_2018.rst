.. title: On the Robustness of Consensus-based Behaviors for Robot Swarms
.. slug: RobustnessConsensus/2018 
.. date: 2018-04-27 12:14:00 UTC
.. tags:
.. link: http://www.mistlab.ca/papers/RobustnessConsensus/2018/
.. description: On the Robustness of Consensus-based Behaviors for Robot Swarms. - Autonomous Robots (Special Issue Foundations of Resilience for Networked Robotic Systems) Supplementary material

.. raw:: html

	<h2> Autonomous Robots (Special Issue Foundations of Resilience for Networked Robotic Systems) Supplementary material</h2>


	<div class="panel panel-default">

	<div class="panel panel-default">
		<div class="panel-heading">
			<h2 class="panel-title">Model Performance </h2>
		</div>
		<div class="panel-body">
            <pre style="float:right;width:50%;margin-left:20px;margin-top:100px;"><code>
        VSKEY = 1
        vs_value = id
        ROBOTS = 10
        <strong> # The robot with the highest id (10) is elected as a leader </strong>
        function init() {
            <strong> # Create a virtual stigmergy </strong>
            vs = stigmergy.create(VSKEY)
            <strong> # Set onconflict manager </strong>
            vs.onconflict(function(k,l,r) {
            <strong> # Return local value if </strong>
            <strong> # - Remote value is smaller than local, OR </strong>
            <strong> # - Values are equal, robot of remote record is smaller than local one </strong>
            if(r.data < l.data or (r.data == l.data and r.robot < l.robot)) {
                return l
            }
            <strong># Otherwise return remote value </strong>
            else return r
            })
            <strong> # Initialize vstig </strong>
            vs.put(VSKEY, vs_value)
            set_leds(255,0,0)
        }
        function step() {
            <strong> # Get current value </strong>
            start_timer()
            vs_value = vs.get(VSKEY)
            <strong> # If the vs_value corresponds to the highest id </strong>
            if (vs_value == ROBOTS) {
                stop_timer()
                log ("I am robot ", id , "my vs_value is", vs_value, "I reached consensus")
                set_leds(0,255,0)
            }
        }
        }</code></pre>
        <p style="text-align:justify;">As discussed in the paper, we have used Statistical Model Checking (SMC) [1] to model and assess the robustness of consensus-based behaviors. In a nutshell, our solution models a robot swarm as a network of priced timed automata NPTA [2]. Each robot in the swarm is represented by a single PTA [2] and is able to communicate its state with its neighborhood. The model is weighted by a set of parameters used to assess the impact of the communication quality and robots’ defects on the consensus behavior of the swarm. Our model is depicted in the figure below. We have studied the performance of our solution by comparing it with a physics-based simulator (ARGoS) [3] and real-world experiments. We have collected the time to convergence while degrading the communication quality (i.e., increasing packet lost probability). The simulations in the three testing environments are performed on an elect leader scenario implemented in a domain specific language Buzz (see the code on the right). The packet loss value is selected from [0%; 25%; 50%; 75%; 95%] and the swarm size is chosen from [5,10].</p>

           <p style="text-align:justify;"> In ARGoS, we have conducted 500 simulations on cluster, scale free and line swarms with different packet loss probabilities, that is 100 simulations for each packet loss probability. The same has been done in the real word experiments where we used a set of of Khepera IV robots [4] connected by a standard 2.4GHz wireless network.</p>

           <p style="text-align:justify;"> The following figures depict a comparison between our proposed model (SMC model), ARGoS and real-world experiments. For the 3 studied topologies (Cluster, Scale-free and Line), the figures show that our model exhibits a convergence time similar to what was recorded using ARGoS and Kheperas. These results confirm that our SMC model is representative of the real robot behavior.</p>
            <img src="PTA_generic.png" class="img-responsive" alt="5-robot cluster topology align="left" width="45%" height="10%"" />


            <hr />
			<h3>Cluster Topology</h3>

			<table>
				<tr>
					<td>
						<h4>5-robot cluster topology</h4>
						<img src="Cluster5.png" class="img-responsive" alt="5-robot cluster topology" />
					</td>
					<td>
						<h4>10-robot cluster topology</h4>
						<img src="Cluster10.png" class="img-responsive" alt="10-robot cluster topology" />
					</td>
				</tr>
			</table>

			<hr />

			<h3>Line Topology</h3>



			<table>
				<tr>
					<td>
						<h4>5-robot line topology</h4>
						<img src="Line5.png" class="img-responsive" alt="5-robot line topology" />
					</td>
					<td>
						<h4>10-robot line topology</h4>
						<img src="Line10.png" class="img-responsive" alt="10-robot line topology" />
					</td>
				</tr>

			</table>

			<hr />

			<h3>Scale-Free Topology</h3>

			<table>
				<tr>
					<td>
						<h4>5-robot scale-free topology</h4>
						<img src="Scalefree5.png" class="img-responsive" alt="5-robot scale-free topology" />
					</td>
					<td>
						<h4>10-robot scale-free topology</h4>
						<img src="Scalefree10.png" class="img-responsive" alt="10-robot scale-free topology" />
					</td>
				</tr>

			</table>

		</div>


    <div class="panel-heading">
        <h2 class="panel-title"> References </h2>
    </div>
        <br>

        </br>
        <ol>

            <li> Bulychev, Peter, et al. "UPPAAL-SMC: Statistical model checking for priced timed automata." arXiv preprint arXiv:1207.1272 (2012).</li>
            <li> David, Alexandre, et al. "Statistical model checking for networks of priced timed automata." International Conference on Formal Modeling and Analysis of Timed Systems. Springer, Berlin, Heidelberg, 2011.</li>
            <li> Pinciroli, Carlo, et al. "ARGoS: a modular, multi-engine simulator for heterogeneous swarm robotics." Intelligent Robots and Systems (IROS), 2011 IEEE/RSJ International Conference on. IEEE, 2011.</li>
            <li> Khepera IV, https://www.k-team.com/mobile-robotics-products/khepera-iv/introduction, Last Visit: 28-05-2018.</li>
            </ol>
        </div>
    </div>

	</div>



