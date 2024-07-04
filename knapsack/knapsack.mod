// --------------------------------------------------------------------------
// Licensed Materials - Property of IBM
//
// 5725-A06 5725-A29 5724-Y48 5724-Y49 5724-Y54 5724-Y55
// Copyright IBM Corporation 1998, 2022. All Rights Reserved.
//
// Note to U.S. Government Users Restricted Rights:
// Use, duplication or disclosure restricted by GSA ADP Schedule
// Contract with IBM Corp.
// --------------------------------------------------------------------------

tuple TItems{
  int i;
};

{TItems} Items = ...;

tuple TResources{
  int r;
};

{TResources} Resources = ...;

tuple TCapacity{
  key int r;
  int c;
};

{TCapacity} Capacity = ...;

int capacity [Resources] = [<C.r>: C.c | C in Capacity];

tuple TValue{
  key int i;
  int v;
};

{TValue} Value = ...;

int value[Items] = [<V.i>: V.v | V in Value];

tuple Tindice{
  key int r;
  key int i;
}
{Tindice} Indice = {<R.r,I.i> | R in Resources, I in Items};

tuple TUse{
  key int r;
  key int i;
  int v;
};

{TUse} Use = ...;

int use[Indice] = [<U.r,U.i>: U.v | U in Use];
int MaxValue = max(r in Resources) capacity[r];
dvar int Take[Items] in 0..MaxValue;


maximize
  sum(i in Items) value[i] * Take[i];
  
subject to {
  forall( r in Resources )
    ct:
      sum( i in Items ) 
        use[<r.r,i.i>] * Take[i] <= capacity[r];
}


tuple TakeSolutionT{ 
	int Items; 
	int value; 
};
{TakeSolutionT} TakeSolution = {<i0.i,Take[i0]> | i0 in Items};
execute{ 
	writeln(TakeSolution);
}
