import { Request, Response } from "express";
import knex from "../database/connection";
import SerializedPoints from './serializedPoints';

class PointsController {
  async index(request: Request, response: Response) {
      const {city, uf, items} = request.query;

      const parserItems = String(items).split(',')
      .map(item => Number(item.trim()));

      const points = await (await knex('points')
      .join('points_items', 'points.id', '=', 'points_items.point_id')
      .whereIn('points_items.item_id', parserItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*'));

      const serializedPoints = SerializedPoints(points);
      return response.json(serializedPoints);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    let point = await knex("points").where("id", id).first();
    if (!point) {
      return response.status(400).json({ message: "Point not found." });
    }

    const items = await knex("items")
      .join("points_items", "items.id", "=", "points_items.item_id")
      .where("points_items.point_id", id)
      .select("items.title");

      const serializedPoint = {
        ...point,
        image_url: `http://192.168.0.50:3332/uploads/${point.image}`,
      };

    point = serializedPoint;
    return response.json({ point, items });
  }

  async create(request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = request.body;

    const trx = await knex.transaction();

    const point = {
      image: request.file.filename,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    };

    const responseIds = await trx("points").insert(point);

    const point_id = responseIds[0];

    const pointItems = items.split(',').map((item: string) => Number(item.trim()))
    .map((item_id: number) => {
      return {
        item_id,
        point_id,
      };
    });

    await trx("points_items").insert(pointItems);

    await trx.commit();

    return response.json({ id: point_id, ...point });
  }
}

export default PointsController;
