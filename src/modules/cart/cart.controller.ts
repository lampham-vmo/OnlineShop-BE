import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartProductDTO } from './dto/cart.dto';
import { RouteName } from 'src/common/decorators/route-name.decorator';
import { ApiResponseWithModel } from 'src/common/decorators/swagger.decorator';
import { CartProduct } from './entities/cart_product.entity';
import { APIResponseDTO } from 'src/common/dto/response-dto';
import { Cart } from './entities/cart.entity';
import { GlobalExceptionFilter } from 'src/common/exceptions/global-exception.filter';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService){}

    @Post()
    @RouteName("Add product to cart")
    async addToCart(@Body() addToCartProductDTO: AddToCartProductDTO) : Promise<APIResponseDTO<{message: string}>>{
        const result = await this.cartService.addProductToCart(addToCartProductDTO.userId,addToCartProductDTO.productId,addToCartProductDTO.quantity)
        if(!result) {
            return {
                statusCode: 400,
                success: false,
                data: {message: "Can not add to cart"}
            }
        }
        return {
            statusCode: 200,
            success: true,
            data: {message: "Sucessfully add to cart"}
        }
    }
    
    @Get(':id')
    @RouteName("Get all product to cart")
    async getCart(@Param('id') userId: string) : Promise<APIResponseDTO<Cart> | BadRequestException>{
        const result = await this.cartService.getAllInCart(Number(userId))
        if(!result) {
            throw new BadRequestException("Can not get a cart")
        }
        return {
            statusCode: 200,
            success: true,
            data: result
        }
    }
}
