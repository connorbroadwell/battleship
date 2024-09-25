defmodule Framework.PlayerSupervisor do
  use Supervisor

  def start_link(_arg) do
    IO.puts "Starting the player supervisor..."
    Supervisor.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  def init(:ok) do
    children = [
    {Framework.PlayerServer, :player_1},
    {Framework.PlayerServer, :player_2}
    ]

    Supervisor.init(children, strategy: :one_for_one)
  end
  
  
end
