/***********************************************************************
 * Task: Street Race                                                   *
 * Figure 1 gives an  example of  a course for a street  race. You see *
 * some  points, labeled  from  0  to  N (here N=9),  and some  arrows *
 * connecting  them. Point 0 is  the start of the race; point N is the *
 * finish. The arrows  represent one-way  streets. The participants of *
 * the race move from point to point via the streets, in the direction *
 * of  the  arrows only. At each  point, a participant  may choose any *
 * outgoing arrow.                                                     *
 *                                                                     *
 *             /\                                          u3xòg __.
 *            /  \                                                     *
 *            \  /                                                     *
 *             ./                                                      *
 *       1     4     7                                                 *
 *      . \   . \   . \                                                *
 *     /   . /   . /   .                                               *
 *    0     3     6     9                                              *
 *     \   . \   . \   .                                               *
 *      . /   . /   . /                                                *
 *       2     5 .__ 8                                                 *
 *                                                                     *
 *  Figure 1. Street Course with 10 points                             *
 *                                                                     *
 * A well-formed course has the following properties:                  *
 *                                                                     *
 * 1. Every point in the course can be reached from the start.         *
 * 2. The finish can be reached from each point in the course.         *
 * 3. The finish has no outgoing arrows.                               *
 *                                                                     *
 * A participant does not have to  visit every point of  the course to *
 * reach  the  finish. Some points, however, are  unavoidable. In  the *
 * example,  these  are  points  0, 3, 6, and 9. Given  a  well-formed * 
 * course, your program has to determine the set of unavoidable points *
 * that  all participants have to visit, excluding  start  and  finish *
 * (Subtask A).                                                        *
 *                                                                     *
 * Suppose the  race has to be held on two  consecutive days. For that *
 * purpose the course  has to be split into two  courses, one for each *
 * day. On the  first day, the  start is at point 0, and the finish at *
 * some  `splitting point'. On  the second day,  the start  is at this *
 * splitting point and the finish is at point N.                       *
 *                                                                     *
 * Given a  well-formed course, your  program has to determine the set *
 * of splitting points (Subtask B). A point S is a splitting point for *
 * the  well-formed  course C if S  differs  from the  start  and  the *
 * finish  of  C, and  the  course can  be split  into two well-formed *
 * courses that have no common  arrows and that  have S as only common *
 * point.  In  the  example,  only  point  3  is  a  splitting  point. *
 *                                                                     *
 * Input Data                                                          *
 * The file INPUT.TXT  describes a  well-formed course with at most 50 *
 * points and at most 100 arrows. There are N+1 lines in the file. The *
 * first N lines contain  the endpoints of  the arrows that leave from *
 * the  points 0 through N-1  respectively.  Each  of these lines ends *
 * with   the  number  -2. The  last  line  contains  the  number  -1. *
 *                                                                     *
 * Output Data                                                         *
 * Your program  should  write two lines to  the file  OUTPUT.TXT. The *
 * first line should contain the number  of unavoidable  points in the *
 * input course, followed  by the labels of these points, in any order *
 * (Subtask A). The second line should contain the number of splitting *
 * points  of the input  course, followed  by the  labels of all these *
 * points, in any order (Subtask B).                                   *
 *                                                                     *
 * Example Input and  Output Figure 2 gives possible  input and output *
 * files for the example of Figure 1.                                  *
 * _____________ ______________                                        *
 * | INPUT.TXT | | OUTPUT.TXT |                                        *
 * |___________| |____________|                                        *
 * | 1 2 -2    | | 2 3 6      |                                        *
 * | 3 -2      | | 1 3        |                                        *
 * | 3 -2      | |____________|                                        *
 * | 5 4 -2    |                                                       *
 * | 6 4 -2    |                                                       *
 * | 6 -2      |                                                       *
 * | 7 8 -2    |                                                       *
 * | 9 -2      |                                                       *
 * | 5 9 -2    |                                                       *
 * | -1        |                                                       *
 * |___________|                                                       *
 *                                                                     *
 * Figure 2: Example input and output                                  *
 *                                                                     *
 ***********************************************************************/
console.log("Street Race");
const WFC = [ // Well-Formed Course
    [1, 2],
    [ 3  ],
    [   3],
    [5, 4],
    [6, 4],
    [6   ],
    [7, 8],
    [ 9  ],
    [5, 9],
    [    ],
];
const N = WFC.length; // Number of points
////////////////////////////////////////////////////////////////////////
var VISITED = new Array( N).fill( false);
var PRE = new Array( N);
var POST = new Array(N );
var CLOCK = 1;
function explore(j ){
    /**/
    VISITED[ j] = true;
    PRE[ j] = CLOCK++;
    for( let u of WFC[ j]) {
        if( VISITED[ u] == false) {
            explore( u);
        }
    }
    POST[ j] = CLOCK++;
}
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//..
function dfs () {
    /* Dasgupta et al. */
    for( let j = 0; j < N; ++j) {
        if( VISITED[ j] == false) {
            explore( j);
        }
    }
}
/***********************************************************************
 * Obviously we can look at race course as a graph, than we can remove *
 * given point and check  wheter there  is a path from start to finish *
 * for  all N - 2 points. This  will solve first sub-problem for about *
 * O(N(N + S)) time, where S is  the number of streets. But if I'm not *
 * mistaken it can be  solved in O(N + S), basically  this is the time *
 * complexity  of  dfs  and  bfs  algorithms.  If  we  remove loop and *
 * backward edges than we'll get a DAG, Direct Acyclyc Graph, than the *
 * first problem can be solved like a Topological Sorting, by removing *
 * nodes without predecessors (sources), if at a given moment there is *
 * a single  source  it is a unavoidable point. For efficiency reasons *
 * we are going to use Knuth's tips and tricks, but first is the dag.  *
 ***********************************************************************/
function isbackward( u, v) /* u ---> v */ {
    return (PRE[u] > PRE[v]) && (POST[u] < POST[v]);
}
var BACKWARD = []; // We'll need that for the second part.
function dag() { 
    dfs (); // get PRE and POST
    let g = Array.from({ length: N }, x => []);
    for( let u = 0; u < N; ++u) {
	for( let v of WFC[ u]) {
	    if (u == v) continue; // loop
	    if (isbackward (u, v)) {
		BACKWARD.push( [u, v]);
		continue;
	    }
	    g[u].push(v);
	}
    }
    return g;
}
function load() {
    // Loading  dag  as  a sequential  list  of objects with two fields:
    // count, which is the  number of in-going edges (predecessors), and
    // adj: adjacency list of neighbors (successors).
    var x = Array.from({length: N}, () => Object({count: 0}));
    var g = dag ();
    for( let j = 0; j < N; ++j) {
	x[ j].adj = g[ j];
	for( let u of g[ j]) {
	    ++x[ u].count;
	}
    }
    return x;
} //////////////////////////////////////////////////////// O (|V| + |E|)
var X = load();
var Queue = []; // Tpuo Tpuk!
var Stk = [];   // Thats stack for unavoidable points
////////////////////////////////////////////////////////////////////////
function srck(j) {
    /* Source check */
    if( X[ j].count == 0) {
	Queue.push( j);
    }
} //////////////////////////////////////////////////////////////// O (1)
function remove( j){
    /* Thats a key function. Loop over jth hood and decrease counters. *
     * If they become 0, push corresponding points to Queue.           */
    for( let u of X[ j].adj) {
	--X[ u].count;
        srck( u);
    }
} ////////////////////////////////////////////////////////////// O (|E|)
function unavoidable() {
    /* Thats sounds like a love song */
    // Yeah initial scan for sources
    for( let j = 0; j < N; ++j) {
        srck( j);
    }
    while( 0 < Queue.length) {
	let gth = Queue.length;
	if( gth == 1){
	    Stk.push( Queue[ 0]);
	}
	for( let j = 0; j < gth; ++j) {
	    remove( Queue.shift( ));
	}
    }
} //////////////////////////////////////////////////////// O (|V| + |E|)
var SubtaskA = () => {
    unavoidable ();
    Stk.shift (); // remove start and finish
    Stk.pop ();   //
    console.log( "Unavoidable points: " + Stk);
};
SubtaskA ();
/***********************************************************************
 * Ok now we have the unavoidable points in Stk, and backward edges in *
 * BACKWARD. If an unavoidable point is not reachable from a  backward *
 * than it's a split point.                                            *
 ***********************************************************************/
function bfs (u, v) {
    /* ck vether v is reachable from u */
    let visited = new Array( N).fill( false);
    visited[ u] = true;
    let Q = [u ];
    while( 0 < Q.length) {
	u = Q.shift ();
	for( let n of WFC[ u]) {
	    if( visited[ n]) continue;
	    if( n == v) return true;
	    Q.push( n);
	}
    }
    return false;
} //////////////////////////////////////////////////////////////////////
var SubtaskB = () => {
    let split = [];
    for( let [_, u] of BACKWARD) {
	for( let v of Stk) {
	    if( bfs( u, v) == false) {
		split.push( v);
	    }
	}
    }
    console.log( "Split points: ", split);
}
SubtaskB ();
////////////////////////////////////////////////////////////////////////
// log:
