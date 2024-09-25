defmodule Framework.PlayerServer do
  use GenServer

  defmodule State do
    defstruct game_board: [], is_turn: false
  end

  def child_spec(player_id) do
    %{
      id: player_id,
      start: {__MODULE__, :start_link, [player_id]},
      restart: :permanent,
      shutdown: 5000,
      type: :worker
    }
  end
  
  def init(state) do
    game_board = create_game_board()
    {:ok, %{state | game_board: game_board}}
  end

  def start_link(player_id) do
    IO.puts("Starting a player server...")
    GenServer.start_link(__MODULE__, %State{}, name: player_id)
  end

  @doc """
  Creates a 10x10 game board. Can hold the values
  :ship, :water, :enemy_hit, or :enemy_missed
  """
  def create_game_board() do
    board_size = 10 * 10
    calc_y = fn(num) -> num / 10 - rem(num, 10) / 10 |> round end
    Enum.reduce(1..board_size, [], fn num, acc ->
      x = rem(num, 10)
      y = calc_y.(num)
      num_position = Integer.to_string(y) <> Integer.to_string(x)
      [%{status: :water, coordinates: {rem(num, 10), calc_y.(num)}} | acc]
    end)
  end

  # def attack(send())

end
