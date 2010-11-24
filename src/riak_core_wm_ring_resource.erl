%%% @doc Ring visualization resource.
%%% @author Uwe Dauernheim <uwe@dauernheim.net>
-module(riak_core_wm_ring_resource).

-author("Uwe Dauernheim <uwe@dauernheim.net>").

-export([ init/1
	, to_html/2
	]).

-include_lib("webmachine/include/webmachine.hrl").

-record(chstate, {
    nodename, % the Node responsible for this chstate
    vclock,   % for this chstate object, entries are {Node, Ctr}
    chring,   % chash ring of {IndexAsInt, Node} mappings
    meta      % dict of cluster-wide other data (primarily bucket N-value, etc)
}). 

init([]) ->
  {ok, undefined}.

to_html(ReqData, Context) ->
  Result = template(get_ring()),
  {Result, ReqData, Context}.

get_ring() ->
  {ok, State} = riak_core_ring_manager:get_my_ring(),
  {_, Ring} = State#chstate.chring,
  Ring.

template(Ring) ->
  Data = {struct, Ring},
  io_lib:format(
    "<html>\n"
    "<head>\n"
    "<title>Riak Core Ring Visualizer</title>\n"
    "<script src=\"js/canto-0.15.js\"></script>\n"
    "<script src=\"js/ring_viz.js\"></script>\n"
    "<script>\n"
    "const RINGDATA = ~s\n"
    "</script>\n"
    "</head>\n"
    "\n"
    "<body onload=\"visualize(ring_canvas, RINGDATA)\">\n"
    "<canvas id=\"ring_canvas\" width=\"600\" height=\"600\"></canvas>\n"
    "</body>\n"
    "</html>\n", [json_pp:print(mochijson2:encode(Data))]).
