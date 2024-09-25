defmodule FrameworkWeb.PageController do
  use FrameworkWeb, :controller

  def battle_ship_main_menu(conn, _params) do
    conn
    |> render(:battle_ship_main_menu)
  end
end
