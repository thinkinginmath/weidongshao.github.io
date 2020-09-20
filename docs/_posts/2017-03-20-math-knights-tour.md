---
layout: post
title:  "Elementary Math: Knight's Tour"
date:   2017-03-20 05:15:17 +0800
categories:
   - Kids' Math
tags:
  - elementary math
  - knight's tour
  - chess board
  - Hamiltonian path
  - Hamiltonian cycle
author: David Wei Shao

---

* content
{:toc}

## Knight's tour on chess board

A knight's tour is a sequence of moves of a knight on a chessboard such that the knight visits every square exactly once. It is an instance of the more general Hamiltonian path problem in graph theory.


## Random Move





One naive approach is to move to the next available empty cell. If there are multiple choices, pick one at random. Do this until it finishes or it is stuck, in which case all legal moves lead to a previously visited cell.  We did an experiment on 8x8 checkboard. It turns out that it is almost impossible to visit all cells of the chessboard. It gets stuck before visiting all the cells.

The following picture shows two different runs with random move, the first one was stuck at the 11th step.

<img src="/assets/2017/low_knights.png" width="300"/><img src="/assets/2017/low_trace.png" width="300"/>


The second run has a better luck, stuck at the  50th step.

<img src="/assets/2017/high_knights.png" width="300"/><img src="/assets/2017/high_trace.png" width="300"/>

## Warnsdorff's Rule

Warnsdorff's rule is a heuristic for finding a single knight's tour. The knight is moved so that it always proceeds to the square from which the knight will have the fewest onward moves. It is an example of greedy algorithm.

We get the following result from this algorithm.

<img src="/assets/2017/full_knights_sol.png" width="300"/><img src="/assets/2017/full_knights_trace.png" width="300"/>

## Earliest Hamilton Path and Cycle

There was records of Knight tour as early as A.D 800.

<img src="/assets/2017/ancient_path.png" width="300"/>

```
// Hamiltonian path from ancient works
var steps = [
   [0,0], [1,2], [0,4], [1,6], [3,7], [5,6], [7,7], [6,5],
   [7,3], [6,1], [4,0], [2,1], [0,2], [1,4], [0,6], [2,7],
   [4,6], [6,7], [7,5], [6,3], [7,1], [5,0], [3,1], [1,0],
   [2,2], [0,3], [1,5], [0,7], [2,6], [4,7], [6,6], [7,4],
   [6,2], [7,0], [5,1], [3,0], [1,1], [3,2], [2,4], [0,5],
   [1,7], [3,6], [5,7], [7,6], [6,4], [7,2], [6,0], [4,1],
   [2,0], [0,1], [1,3], [2,5], [4,4], [2,3], [4,2], [5,4],
   [3,5], [4,3], [5,5], [3,4], [5,3], [4,5], [3,3], [5,2]];
```


<img src="/assets/2017/ancient_cycle.png" width="300"/>

```
// Hamiltonian cycle from ancient works
var steps = [
    [0,0],[2,1],[1,3],[0,1],[2,0],[3,2],[4,0],[6,1],
    [7,3],[6,5],[7,7],[5,6],[3,7],[4,5],[5,7],[7,6],
    [6,4],[7,2],[6,0],[5,2],[4,4],[3,6],[1,7],[0,5],
    [2,4],[1,6],[0,4],[2,5],[3,3],[4,1],[5,3],[7,4],
    [6,6],[5,4],[7,5],[6,7],[4,6],[3,4],[5,5],[4,7],
    [3,5],[2,7],[0,6],[1,4],[2,6],[0,7],[1,5],[2,3],
    [0,2],[1,0],[2,2],[0,3],[1,1],[3,0],[4,2],[6,3],
    [7,1],[5,0],[6,2],[7,0],[5,1],[4,3],[3,1],[1,2],
    [0,0]];
```
