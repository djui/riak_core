%%% @doc Test the ring visualization feature.
%%% Usage: 
%%%   $ make
%%%   $ erlc -o test test/ring_viz.erl
%%%   $ erl -pa ebin deps/*/ebin test -s ring_viz
%%%   $ open http://localhost:8089/ring
%%% @author Uwe Dauernheim <uwe@dauernheim.net>
-module(ring_viz).

-author("Uwe Dauernheim <uwe@dauernheim.net>").

-export([ start/0]).

start() ->
  application:load(riak_core),
  riak_core_util:start_app_deps(riak_core),
  application:start(riak_core),

  RingSize = 16,
  Nodes = [nodeA, nodeB, nodeC, nodeD],
  Ring = riak_core_ring:fresh(RingSize, node()),
  Owners = riak_core_ring:all_owners(Ring), 
  TransferNode =
    fun({Idx,_CurOwner}, {Ring0, [NewOwner|Rest]}) ->
        {riak_core_ring:transfer_node(Idx, NewOwner, Ring0), Rest ++ [NewOwner]}
    end,
  {PerfectRing, _} = lists:foldl(TransferNode, {Ring, Nodes}, Owners),
  riak_core_ring_manager:set_ring_global(PerfectRing).
