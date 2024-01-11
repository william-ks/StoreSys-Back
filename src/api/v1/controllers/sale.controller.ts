import { Request, Response } from "express";
import { prisma } from "../../../services/prisma";

interface test {
  id: number;
  title: string;
  value: number;
}

class saleController {
	public async create(req: Request, res: Response): Promise<Response> {
		const { title, products, discount_for_client, sale_type_id, machine_id, sold_at } =
      req.body;
		const { id: userId } = req.user;



		if (sale_type_id < 1 || sale_type_id > 4) {
			return res.status(400).json({ message: "Tipo de venda inválido." });
		}

		if (discount_for_client < 0) {
			return res
				.status(400)
				.json({ message: "Esse valor de desconto é inválido" });
		}

		try {
			if (sale_type_id >= 3) {
				if (!machine_id) {
					return res.status(400).json({
						message: "Para vendas no cartão é preciso ter uma maquininha",
					});
				} else {
					const machineFound = await prisma.machine.findFirst({
						where: {
							id: machine_id,
						},
					});

					if (!machineFound) {
						return res
							.status(404)
							.json({ message: "Essa maquininha não foi encontrada." });
					}
				}
			}

			const productsFound: any = [];
			let total = 0;
			let newTitle: string = title ?? "";

			products.forEach((element: any) => {
				if (!element.id) {
					return res.status(400).json({ message: "Produto inválido" });
				}

				if (element.amount <= 0) {
					return res
						.status(400)
						.json({ message: "O mínimo da quantidade de um produto é 1." });
				}
			});

			for (const actualProduct of products) {
				const actual = await prisma.product.findFirst({
					where: {
						AND: {
							isDeleted: false,
							id: actualProduct.id,
						},
					},
				});

				if (!actual) {
					return res
						.status(400)
						.json({ message: `Produto de id=${actualProduct.id} inválido` });
				}

				if (!title) {
					newTitle += ` ${actualProduct.amount} ${actual.name},`;
				}

				if (actual.stock < actualProduct.amount) {
					return res.status(400).json({
						message: "A quantidade de produtos excede a quantidade em estoque.",
					});
				}

				total += actual.value * actualProduct.amount;

				productsFound.push({
					id: actual.id,
					name: actual.name,
					value: actual.value,
					amount: actualProduct.amount,
					category_id: actual.category_id,
				});
			}

			if (!title) {
				const lastComma = newTitle.lastIndexOf(",");
				newTitle = newTitle.slice(0, lastComma);
			}

			if (discount_for_client > total) {
				return res.status(400).json({
					message: "O desconto não pode ser maior que o total de produtos",
				});
			}

			const data = {
				title: newTitle,
				products: productsFound,
				total,
				discount_for_client: discount_for_client,
				sale_type_id: sale_type_id,
				machine_id: sale_type_id <= 2 ? null : machine_id,
				sold_by_id: userId as number,
				sold_at,
			};

			for (const actualProduct of products) {
				const acutal = await prisma.product.findFirst({
					where: {
						AND: {
							isDeleted: false,
							id: actualProduct.id,
						},
					},
				});

				if (!acutal) {
					return res
						.status(400)
						.json({ message: `Produto de id=${actualProduct.id} inválido` });
				}

				if (!acutal.stock) {
					return res
						.status(500)
						.json({ message: "Erro interno ao atualizar o estoque." });
				}

				await prisma.product.update({
					data: {
						stock: acutal.stock - actualProduct.amount,
					},
					where: {
						id: acutal?.id,
					},
				});
			}

			const response = await prisma.sale.create({
				data: data,
			});

			return res.status(201).json(response);
		} catch (e) {
			console.log(e);
			return res.status(500).json({ message: "Erro interno no servidor." });
		}
	}

	public async readAll(req: Request, res: Response): Promise<Response> {
		try {
			const sales = await prisma.sale.findMany({
				include: {
					sold_by: {
						select: {
							id: true,
							name: true,
						},
					},
					machine: true,
					sale_type: {
						select: {
							title: true,
						},
					},
				},
				orderBy: {
					sold_at: "desc",
				},
			});
			return res.status(200).json(sales);
		} catch (e) {

			return res.status(500).json({ message: "Erro interno no servidor." });
		}
	}

	public async readOne(req: Request, res: Response): Promise<Response> {
		const { id } = req.params;

		if (!Number(id)) {
			return res.status(400).json({
				message: "Parâmetro inválido.",
			});
		}

		try {
			const sale = await prisma.sale.findFirst({
				where: {
					id: Number(id),
				},
				include: {
					sold_by: {
						select: {
							id: true,
							name: true,
						},
					},
					machine: true,
					sale_type: {
						select: {
							title: true,
						},
					},
				},
				orderBy: {
					sold_at: "asc",
				},
			});

			if (!sale) {
				return res.status(404).json({ message: "Essa venda não existe." });
			}

			return res.status(200).json(sale);
		} catch (e) {
			return res.status(500).json({ message: "Erro interno no servidor." });
		}
	}

	public async readPaymentsMethods(req: Request, res: Response): Promise<Response> {
		try {
			const payments = await prisma.saleType.findMany({
				orderBy: {
					id: "asc"
				}
			});

			return res.status(200).json(payments);
		} catch (e) {
			return res.status(500).json({ message: "Erro interno no servidor." });
		}
	}

	public async update(req: Request, res: Response): Promise<Response> {
		const {
			title,
			products,
			discount_for_client,
			sale_type_id,
			machine_id,
			sold_at,
			old_products,
		} = req.body;

		const { id: userId } = req.user;
		const { id: saleId } = req.params;

		if (!Number(saleId)) {
			return res.status(400).json({
				message: "Parâmetro inválido",
			});
		}

		if (sale_type_id < 1 || sale_type_id > 4) {
			return res.status(400).json({ message: "Tipo de venda inválido." });
		}

		if (discount_for_client < 0) {
			return res
				.status(400)
				.json({ message: "Esse valor de desconto é inválido" });
		}

		try {
			if (sale_type_id >= 3) {
				if (!machine_id) {
					return res.status(400).json({
						message: "Para vendas no cartão é preciso ter uma maquininha",
					});
				} else {
					const machineFound = await prisma.machine.findFirst({
						where: {
							id: machine_id,
						},
					});

					if (!machineFound) {
						return res
							.status(404)
							.json({ message: "Essa maquininha não foi encontrada." });
					}
				}
			}

			const SaleToUpdate = await prisma.sale.findFirst({
				where: {
					id: Number(saleId),
				},
			});

			if (!SaleToUpdate) {
				return res
					.status(404)
					.json({ message: "Venda não foi encontrada ou não existe." });
			}

			const productsFound: any = [];
			let total = 0;
			let newTitle: string = title ?? "";

			// validando produtos fornecidos
			products.forEach((element: any) => {
				if (!element.id) {
					return res.status(400).json({ message: "Produto inválido" });
				}

				if (element.amount <= 0) {
					return res
						.status(400)
						.json({ message: "O mínimo da quantidade de um produto é 1." });
				}
			});

			// recolocando produtos no estoque
			for (const actualProduct of old_products) {
				const acutal = await prisma.product.findFirst({
					where: {
						AND: {
							id: actualProduct.id,
						},
					},
				});

				if (!acutal) {
					return res
						.status(400)
						.json({ message: `Produto de id=${actualProduct.id} inválido` });
				}

				await prisma.product.update({
					where: {
						id: actualProduct.id,
					},
					data: {
						stock: acutal.stock + actualProduct.amount,
					},
				});
			}

			// continue
			for (const actualProduct of products) {
				const actual = await prisma.product.findFirst({
					where: {
						AND: {
							isDeleted: false,
							id: actualProduct.id,
						},
					},
				});

				if (!actual) {
					return res
						.status(400)
						.json({ message: `Produto de id=${actualProduct.id} inválido` });
				}

				if (!title) {
					newTitle += ` ${actualProduct.amount} ${actual.name},`;
				}

				if (actual.stock < actualProduct.amount) {
					return res.status(400).json({
						message: "A quantidade de produtos excede a quantidade em estoque.",
					});
				}

				if (actualProduct.value) {
					total += actualProduct.value * actualProduct.amount;

					productsFound.push({
						id: actual.id,
						name: actual.name,
						value: actualProduct.value,
						amount: actualProduct.amount,
						category_id: actual.category_id,
					});
				} else {
					total += actual.value * actualProduct.amount;

					productsFound.push({
						id: actual.id,
						name: actual.name,
						value: actual.value,
						amount: actualProduct.amount,
						category_id: actual.category_id,
					});
				}
			}

			if (!title) {
				const lastComma = newTitle.lastIndexOf(",");
				newTitle = newTitle.slice(0, lastComma);
			}

			if (discount_for_client > total) {
				return res.status(400).json({
					message: "O desconto não pode ser maior que o total de produtos",
				});
			}

			const data = {
				title: newTitle,
				products: productsFound,
				total,
				discount_for_client: discount_for_client,
				sale_type_id: sale_type_id,
				machine_id: sale_type_id <= 2 ? null : machine_id,
				sold_at,
				sold_by_id: userId as number,
			};

			for (const actualProduct of products) {
				const acutal = await prisma.product.findFirst({
					where: {
						AND: {
							isDeleted: false,
							id: actualProduct.id,
						},
					},
				});

				if (!acutal) {
					return res
						.status(400)
						.json({ message: `Produto de id=${actualProduct.id} inválido` });
				}

				if (!acutal.stock) {
					return res
						.status(500)
						.json({ message: "Erro interno ao atualizar o estoque." });
				}

				await prisma.product.update({
					data: {
						stock: acutal.stock - actualProduct.amount,
					},
					where: {
						id: acutal?.id,
					},
				});
			}

			const response = await prisma.sale.update({
				data: data,
				where: {
					id: Number(saleId),
				},
			});

			return res.status(201).json(response);
		} catch (e) {
			return res.status(500).json({ message: "Erro interno no servidor." });
		}
	}

	public async delete(req: Request, res: Response): Promise<Response> {
		const { id: idToDel } = req.params;

		if (!Number(idToDel)) {
			return res.status(400).json({ message: "Parâmetro inválido." });
		}

		try {
			const sale = await prisma.sale.findFirst({
				where: {
					id: Number(idToDel),
				},
			});

			if (!sale) {
				return res.status(400).json({ message: "Venda não encontrada." });
			}

			if (!sale.products) {
				return res.status(500).json({ message: "Erro interno no servidor." });
			}

			const products: any = [...sale.products];

			// recolocando produtos no estoque
			for (const actualProduct of products) {
				const acutal = await prisma.product.findFirst({
					where: {
						AND: {
							id: actualProduct.id,
						},
					},
				});

				if (!acutal) {
					return res.status(400).json({
						message: `Produto de id=${actualProduct.id} não foi encontrado`,
					});
				}

				await prisma.product.update({
					where: {
						id: actualProduct.id,
					},
					data: {
						stock: acutal.stock + actualProduct.amount,
					},
				});
			}

			await prisma.sale.delete({
				where: {
					id: Number(idToDel),
				},
			});

			return res.status(204).end();
		} catch (e) {
			return res.status(500).json({ message: "Erro interno no servidor." });
		}
	}
}

export default new saleController();
