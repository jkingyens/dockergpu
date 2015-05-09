	.section	__TEXT,__text,regular,pure_instructions
	.globl	_square
_square:                                ## @square
	.cfi_startproc
## BB#0:
	pushq	%rbp
Ltmp3:
	.cfi_def_cfa_offset 16
Ltmp4:
	.cfi_offset %rbp, -16
	movq	%rsp, %rbp
Ltmp5:
	.cfi_def_cfa_register %rbp
	pushq	%r15
	pushq	%r14
	pushq	%rbx
	pushq	%rax
Ltmp6:
	.cfi_offset %rbx, -40
Ltmp7:
	.cfi_offset %r14, -32
Ltmp8:
	.cfi_offset %r15, -24
	movl	%edx, %ebx
	movq	%rsi, %r14
	movq	%rdi, %r15
	xorl	%edi, %edi
	callq	_get_global_id
	cmpl	%ebx, %eax
	jae	LBB0_2
## BB#1:
	movl	%eax, %eax
	movl	(%r15,%rax,4), %ecx
	imull	%ecx, %ecx
	movl	%ecx, (%r14,%rax,4)
LBB0_2:
	addq	$8, %rsp
	popq	%rbx
	popq	%r14
	popq	%r15
	popq	%rbp
	ret
	.cfi_endproc

	.section	__TEXT,__const
_sgv:                                   ## @sgv
	.asciz	 "220"

_fgv:                                   ## @fgv
	.byte	0

	.align	3                       ## @lvgv
_lvgv:
	.byte	0


.subsections_via_symbols
